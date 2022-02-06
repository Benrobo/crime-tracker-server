### Crime Tracker Logic
-------
This system is made up of two different users having different roles
`admin` and `officer`.

The system can have multiple admins having level of permissions to take certain actions.

Before allowing other `officers` to get registered into the system, officer are sent a one time `code` which would be used when creating a new account. If the code expires, request would lead to failure making it more secure from allowing fake users signing up as a officer.

The admin would then be able to `grant` officer request or `reject` request.

#### Permissions
This are the list of permissions present in the system

- `Admin`
  - [x] Grant other officers requests when registering.
  - [x] View all officers within the system.
  - [x] Engage in `predicting` crime cases.
  - [x] View all crime `evidence`.
  - [x] Assign case to be taken care off by other officers within the system.
  - [x] Delete all case only `admin` not officer .
  - [x] Delete officers from the system.
  - [x] Add Evidence for a particular crime case.
  
- `Users`
  - [x] View all officers within the system.
  - [x] Engage in `predicting` crime cases.
  - [x] View all crime `evidence`.
  - [x] Add Evidence for a particular crime case.  
