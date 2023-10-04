import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function getPercentColor(percentPassed) {
    if (percentPassed > 75) {
        return 'green';
    } else if (percentPassed > 25) {
        return 'orange';
    } else {
        return 'red';
    }
}

export function sendEmail(toMail, percentPassed, url, projectName, statusContent, normeContent) {
    const percentColor = getPercentColor(percentPassed);

    const emailContent = `
    <html>
    <head>
        <style>
            /* Style CSS pour la mise en page de l'e-mail */
            body {
                font-family: Arial, sans-serif;
            }
            .container {
                background-color: #f4f4f4;
                padding: 20px;
            }
            .header {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .percent {
                font-size: 18px;
                color: ${percentColor}; /* Couleur dynamique en fonction du pourcentage */
            }
            .section {
                margin-top: 20px;
            }
            .norme {
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">${projectName} | <span class="percent">${percentPassed}%</span></div>
            <div class="section">
                <p><strong>Status</strong></p>
                <p>${statusContent}</p>
            </div>
            <div class="section">
                <p><strong>Norme</strong></p>
                <pre class="norme">${normeContent}</pre>
            </div>
            <div class="section">
                <p><strong>Test URL</strong></p>
                <p><a href="${url}">${url}</a></p>
            </div>
        </div>
    </body>
    </html>
`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toMail,
        subject: `New mouli | ${projectName}`,
        html: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error when sending email:', error);
        } else {
            console.log('E-mail send !');
        }
    });
}
