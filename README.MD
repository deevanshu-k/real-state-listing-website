## REAL STATE LISTING

### Development Setup
1) Add db config in config/db.config.js
2) Add env/development.env
   ```
   NODE_ENV=development
   HOST=127.0.0.1
   PORT=3000
   SECRET=SSSSS
   TOKEN_EXP_TIME='5m'
   SMTP_PORT=465
   SMTP_HOST=smtp.hostinger.com
   MAIL_FROM=developmenttest@rentqube.com
   MAIL_USER=developmenttest@rentqube.com
   MAIL_USER_PASSWORD=User@12345
   CLIENT_URL='http://127.0.0.1:4200'
   razorpay_key_id='<--key-id-->'
   razorpay_key_secret='<--secret-->'
   razorpay_webhook_secret='<--web-hook-secret-->'
   ```
3) Command
   ```bash
      npm run dev
   ```

### API

1) Properties
   - LANDLORD: add property
   - LANDLORD: delete property
   - LANDLORD: update property-name
   - LANDLORD: get property

2) Rooms:
   - LANDLORD: add rooms (based on plan)
      ```
      if(standard plan)
      ```
   - ADMIN: verify rooms
   - LANDLORD: update rooms (details + image) (only updating details are passed)
   - LANDLORD: delete rooms
   - LANDLORD: get rooms
   - TENANT: get rooms (based on plan)

3) Landlord:
   - publishProperty-Des-if(count(p-published) > n) (PATCH #21)
   
4) Admin:
   - Get all landlords **DONE**
   - Get all tenants **DONE**
   - Get all properties after (PATCH #21) **DONE**

   - Update profile photo

   - Get landlord documents **DONE**
   - Get tenant documents **DONE**

   - Verify Landlord ( Also mail integration ) **DONE**
   - Verify Tenant  ( Also mail integration ) **DONE**
   - Verify Property  ( Also mail integration ) **DONE**

   - UnVerify landlord ( Also mail integration ) **DONE**
   - UnVerify tenant ( Also mail integration ) **DONE**
   - UnVerify property ( Also mail integration ) **DONE**

   - Delete tenant ( Also mail integration ) 
   - Delete landlord ( Also mail integration ) 

   - Delete property ( Also mail integration )

   - Get server logs ( **Main--Security** )
   - Get server health ( **Main--Security** )