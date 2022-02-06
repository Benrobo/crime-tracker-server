### Crime-Tracker API

------ 

This contain the backend logic of `crime-tracker` client app.


### Tasks and Features to be added.

------

This are the curated list of backend logic yet to be implemented.

- [] Authication.
  - [] register admin.
  - [] generate ontime code for each user who wanna get them selves registered into the system.
  - [] send the one time code to the `officer` mail address using `node_mailer`.
  - [] validate officer request data sent from client including the code.
  - [] save officer data in `postgresqlDB`
- [] Authorization.
  - generate a `jwt_refresh_token` && `jwt_acccess_token` containing users details.
  - send generated token to client which would then be used in `route` protection.
