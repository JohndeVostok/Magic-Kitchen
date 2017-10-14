#coding=utf-8
import smtplib
from email.mime.text import MIMEText
from email.header import Header

def send_email(title, context, receiver):
        mail_host = "smtp.163.com"

        mail_user = "Teamname_CodeCheF@163.com"
        mail_pass = "codechef"

        sender = 'Teamname_CodeCheF@163.com'
        receivers = [receiver]

        message = MIMEText(context, 'plain', 'utf-8')
        message['From'] = sender
        message['To'] =  receivers[0]

        subject = title
        message['Subject'] = Header(subject, 'utf-8')

        try:
                smtpObj = smtplib.SMTP()
                smtpObj.connect(mail_host, 25)
                smtpObj.login(mail_user, mail_pass)
                smtpObj.sendmail(sender, receivers, message.as_string())
        except smtplib.SMTPException as e:
                print 'send email failed'
                print e