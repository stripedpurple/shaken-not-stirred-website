var express = require('express');
var router = express.Router();

var db = require('level')('/opt/dev/shortendb');
var nodemailer = require('nodemailer');
var fs = require('fs');
var config = require('../lib/config.js');

var email = config.get('/opt/dev/config/shakennotstirred', 'emailAddress');
var password = config.get('/opt/dev/config/shakennotstirred', 'emailPassword');
var contactFile = config.get('/opt/dev/config/shakennotstirred', 'contactFile');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get(['instagram', '/insta'], function (req, res, next) {
    res.redirect('http://www.instagram.com/shakennotstirredphoto');
});

router.get(['/facebook', '/fb'], function (req, res, next) {
    res.redirect('http://fb.me/shakennotstiredphoto/');
});

router.get(['/messenger', '/msgr'], function (req, res, next) {
    res.redirect('http://m.me/shakennotstiredphoto/');
});

router.get(['/contacts/list', '/msgr'], function (req, res, next) {
    fs.readFile('/opt/dev/data/shakennotstirred.contacts.json', 'utf8', function (err, contacts) {
        if (err) {
            res.status(500).send('We encountered an error. Please try again later.')
        } else {
            contacts = JSON.parse('[' + contacts.replace(/\n/g, ',').slice(0, -1) + ']');
            res.render('contacts-list', { contacts: contacts });
        }
    });
});

router.get('/app/health', function (req, res, next) {
    res.status(200).send()
});


router.post('/contact', (req, res, next) => {
    var info = {};
    for (var key in req.body) {
        info[key] = req.body[key];
    }

    console.log(req.body);

    if (!info.name || info.name === '') {
        res.status(400).send('Name is required!');
        return;
    }

    if (!info.email || info.email === '') {
        res.status(400).send('Email is required!');
        return;
    }

    fs.appendFile(contactFile, JSON.stringify(info) + "\n", function (err) {
        if (err) {
            log.error('Error writing to ' + contactFile, err);
        }
    });

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password
        }
    });

    var mailOptions = {
        from: 'do-not-reply@shakennotstirred.photos',
        to: info.email,
        subject: 'Thanks for contact Shaken Not Stirred!',
        html: '<!doctypehtml><meta content="width=device-width"name=viewport><meta content="text/html; charset=UTF-8"http-equiv=Content-Type><title>Thanks for contacting Shaken Not Stirred Photography!</title><style>@media only screen and (max-width:620px){table[class=body] h1{font-size:28px!important;margin-bottom:10px!important}table[class=body] a,table[class=body] ol,table[class=body] p,table[class=body] span,table[class=body] td,table[class=body] ul{font-size:16px!important}table[class=body] .article,table[class=body] .wrapper{padding:10px!important}table[class=body] .content{padding:0!important}table[class=body] .container{padding:0!important;width:100%!important}table[class=body] .main{border-left-width:0!important;border-radius:0!important;border-right-width:0!important}table[class=body] .btn table{width:100%!important}table[class=body] .btn a{width:100%!important}table[class=body] .img-responsive{height:auto!important;max-width:100%!important;width:auto!important}}@media all{.ExternalClass{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}.apple-link a{color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:none!important}.btn-primary table td:hover{background-color:#34495e!important}.btn-primary a:hover{background-color:#34495e!important;border-color:#34495e!important}}</style><body style=background-color:#f6f6f6;font-family:sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.4;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%><table style=border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:100%;background-color:#f6f6f6 border=0 cellpadding=0 cellspacing=0 class=body><tr><td style=font-family:sans-serif;font-size:14px;vertical-align:top> <td style="font-family:sans-serif;font-size:14px;vertical-align:top;display:block;Margin:0 auto;max-width:580px;padding:10px;width:580px"class=container><div class=content style="box-sizing:border-box;display:block;Margin:0 auto;max-width:580px;padding:10px"><span class=preheader style=color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0>Thanks for contacting Shaken Not Stirred Photography!</span><table style=border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:100%;background:#fff;border-radius:3px class=main><tr><td style=font-family:sans-serif;font-size:14px;vertical-align:top;box-sizing:border-box;padding:20px class=wrapper><table style=border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:100% border=0 cellpadding=0 cellspacing=0><tr><td style=font-family:sans-serif;font-size:14px;vertical-align:top><p style=font-family:sans-serif;font-size:14px;font-weight:400;margin:0;Margin-bottom:15px>' + req.body.name + ',<p style=font-family:sans-serif;font-size:14px;font-weight:400;margin:0;Margin-bottom:15px>Thanks for contacting Shaken Not Stirred Photography. We will be in touch ASAP.</p><br><table style=border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:100%;box-sizing:border-box border=0 cellpadding=0 cellspacing=0 class="btn btn-primary"><tr><td style=font-family:sans-serif;font-size:14px;vertical-align:top;padding-bottom:15px align=left><table style=border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:auto border=0 cellpadding=0 cellspacing=0><tr><td style=font-family:sans-serif;font-size:14px;vertical-align:top;background-color:#3498db;border-radius:5px;text-align:center><a href=http://shakennotstirred.photos style="display:inline-block;color:#fff;background-color:#3498db;border:solid 1px #3498db;border-radius:5px;box-sizing:border-box;cursor:pointer;text-decoration:none;font-size:14px;font-weight:700;margin:0;padding:12px 25px;text-transform:capitalize;border-color:#3498db"target=_blank>Visit Our Site</a></table></table></table></table><div class=footer style=clear:both;Margin-top:10px;text-align:center;width:100%><table style=border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:100% border=0 cellpadding=0 cellspacing=0><tr><td style=font-family:sans-serif;vertical-align:top;padding-bottom:10px;padding-top:10px;font-size:12px;color:#999;text-align:center class=content-block><ul style=list-style-type:none;margin:0;padding:0><li style=display:inline-block><a href=//shakennotstirred.photos/insta><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALQSURBVGhD7ZnXyhRBEIVXL02/+hZi+o1geAcxPorhwvAoKuKNqJjAdKF4Keqd8QHUBzCgGM4H21A0Z3fS9gzKHPjYoae2emu6u7qmdzJq1KhR/71WiL3igrgs7otHHcEHvvC5R9BHMeH8hHgv/hSGPo6JhQe0RtwSrtOS3BT0vRCtFa+E66gPXopVopMY2r5H4qE4Of1MbTdEp2nGmoidlOaBiCIRpHtHaWgjnkAfCztySkSdEeneW9FqVEixsZM+YASS+NFxRGC3aCxyenTSlE+CeX5pCte0OdsIdqfF49CWOCcai85zR1X8Emxs+8RKkYu2/eKKwNb5mMdF0Vj5sFbxRuwQdYXtO+F8zSJOvdp6JpwzxxOxXjTVBsF3nU8Hv6mx6gZCNlkSTgS3a8osG9o/COc7p1ggzPNlkWu7uCd+imTL9W3BvVw7xW8RfTuKBcLCznVcfBPOHrh3ROQiATj7SLFAyE5R28R34WwjX8QWEXVAONtIkUA+ijzF3hXO1nFHROHrs3C2iSKB5KmQhf1DOFsHtlTWUVUpv0ggbJhRlA/Obh5ks6iqTXgMxDlL5FNrneg6tVx9FSkSCAVgvthZwM7WwQtb1GCLHSgAo7YKUquzjWCzWUQdFM42UiwQNrFcvMnN2xC/ikMi11Xh7CPFAqFEcRUvmx1TJ64ZrmnbJHKx6ActUYCCb1ZBSALgR1JLce20UQxeNCaeCkrypiIIvut8OloF0vTFioMKnnxdse/UHYlEqxertq+6LFoKwDw1I9rITtjUWRM5rV51zwvnrC7sCTxBHghwXbVPVNHq8IFTcedsSPKSppY4V2p6OFASDjdaH5tytO+cDsFh0Vo8AY72neM+uSY6iyP9F8J10AfPRee/FZL4s+W6cB2VhJFYLRYqphmnH30kgNei05qoIwJiVyansz8s6s9QfJ0VpNjW2WnUqFGj/gVNJn8BI2A0u6zHe84AAAAASUVORK5CYII="style=max-width:24px></a><li style=display:inline-block><a href=//shakennotstirred.photos/messenger><img src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALjSURBVGhD7dlLqE1RHMfxQ/KIKDHwLo/ERJEkySsRAyMjzExJZookkyskKaakKKIYmJBXmXmUECMKieSRRx55fH91Vu12/3PXWnvtx7l1fvXp3nZnPf737nPWWvu0eumll1ozBZtxABdwG3fb9Luu9WETJqOrosnvxhP8i/QYaqs+GstMnMYvWJOMoT7Ul/qsLcOh2+MnrEmlUJ/7MQyVZi4ewppEmR5gNirJCnyANXAVNNYylJrV+AFrwCp9x0qUkoX4BmugOmjs+UjKeLyENUCdXmAcCuccrI6bcAaFsh5Wh01ai6gMgj4Crc6adA+aW3DWweqoG6xBcC7C6iTGb+NarD/GtfMIykikrhnPMB2nMtdi6Bbah7eZa47mNgLepN5WKmIiXLYj5L+jv/4laAcxC69gvU6C3vR7YTUOkS/CRVuNd7DafMVxaPKKfvrWrj3w5iysxj6dinDRmUMHLPf619iFsXAJKUKC1hSd5KzG/fEV4aIjwGFswVBdyCS0CLkJb2LXj9Ai+osOVDFbofvwRp8YVmOLipiElMQWIbpFvbkFq3GeVcRo7MBJjNEFT4oUIdfhjc7OVuOsfBHTcAif4V7zFHPQKUWLEM3RG32SWI2dbBGLoB1yp3VChW1APilFiObojT7zrcaiIqZiI+60r/n8hVbpwVBmIKUIWQ5v9ATjC/KN3+AgnmeuxbgMnfRSi9Dcgp+yFN0j1UFzC84SWJ10g6WIyg1YHTVJS0N0FkNvVKvDJmgumlOhaFdqddoEzaVwRuERrI7rpDnowJcU7UrfwxqgDjrHaAEtJQvwCdZAVdKYGrvUnIA1WFW0cM5D6anzjX8VE1BJ6ijkI7Yh6iFcbKosRLtkfYGa9KA6NL5C9Lwp5nmYvje8hq3Qgay2dCpEkz8GnVG0K9UZRc+yjkIHoCvQPa9zi/rYiVVIXheKJl+IK6Drvi/3xRUyYAtwOYIBXYDLkPbPXnrxptX6Dzdbru2hKoPCAAAAAElFTkSuQmCC style=max-width:24px></a><li style=display:inline-block><a href=//shakennotstirred.photos/facebook><img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ1NS43MyA0NTUuNzMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ1NS43MyA0NTUuNzM7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4Ij4KPHBhdGggZD0iTTAsMHY0NTUuNzNoMjQyLjcwNFYyNzkuNjkxaC01OS4zM3YtNzEuODY0aDU5LjMzdi02MC4zNTNjMC00My44OTMsMzUuNTgyLTc5LjQ3NSw3OS40NzUtNzkuNDc1aDYyLjAyNXY2NC42MjJoLTQ0LjM4MiAgYy0xMy45NDcsMC0yNS4yNTQsMTEuMzA3LTI1LjI1NCwyNS4yNTR2NDkuOTUzaDY4LjUyMWwtOS40Nyw3MS44NjRoLTU5LjA1MVY0NTUuNzNINDU1LjczVjBIMHoiIGZpbGw9IiMwMDAwMDAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="style=max-width:24px></a></ul><tr><td style=font-family:sans-serif;vertical-align:top;padding-bottom:10px;padding-top:10px;font-size:12px;color:#999;text-align:center class=content-block><span class=apple-link style=color:#999;font-size:12px;text-align:center>Shaken Not Stirred Photography</span><tr><td style=font-family:sans-serif;vertical-align:top;padding-bottom:10px;padding-top:10px;font-size:12px;color:#999;text-align:center class="content-block powered-by">Powered by <a href=http://htmlemail.io style=color:#999;font-size:12px;text-align:center;text-decoration:none>HTMLemail</a>.</table></div><a href=https://icons8.com style=display:none;visibility:hidden>Icon pack by Icons8</a></div><td style=font-family:sans-serif;font-size:14px;vertical-align:top> </table>'
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
            res.status(200).send();
        }
    });


    var mailOptions2 = {
        from: 'do-not-reply@shakennotstirred.photos',
        to: 'hello@shakennotstirred.photos',
        // to: 'austin@stripedpurple.io',
        subject: 'Website Contact',
        text: 'Name:\t' + info.name +
            '\nEmail:\t' + info.email +
            '\nMessage:\t' + info.message
    };

    transporter.sendMail(mailOptions2, function (err, info) {
        fs.write
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });


});

module.exports = router;
