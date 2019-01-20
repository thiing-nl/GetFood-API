# GetFood API

Make sure you have MongoDB installed.

You can modify the MONGOOSE_URL in the .env file (if it doens't exist create it by copying .env.example)

## Continous Integration

Every commit **against master** will be tested / compiled in CircleCi, and once completed/succesful will be deployed to our server [api.getfood.io](api.getfood.io)


## Methods

| Method 	| Endpoint                           	| Class method                         	|
|--------	|------------------------------------	|--------------------------------------	|
| POST   	| /v1/family/                        	| FamilyController.create()            	|
| GET    	| /v1/family/                        	| FamilyController.getActiveFamily()   	|
| PUT    	| /v1/family/                        	| FamilyController.update()            	|
| DELETE 	| /v1/family/                        	| FamilyController.leaveActiveFamily() 	|
| POST   	| /v1/family/:familyId/join          	| FamilyController.joinFamily()        	|
| POST   	| /v1/list/:listId/items/            	| ListItemController.create()          	|
| PUT    	| /v1/list/:listId/items/:listItemId 	| ListItemController.update()          	|
| DELETE 	| /v1/list/:listId/items/:listItemId 	| ListItemController.delete()          	|
| POST   	| /v1/list/                          	| ListController.create()              	|
| GET    	| /v1/list/                          	| ListController.getLists()            	|
| GET    	| /v1/list/colors                    	| ListController.getColors()           	|
| GET    	| /v1/list/:listId                   	| ListController.get()                 	|
| PUT    	| /v1/list/:listId                   	| ListController.update()              	|
| DELETE 	| /v1/list/:listId                   	| ListController.delete()              	|
| POST   	| /v1/user/                          	| UserController.register()            	|
| POST   	| /v1/user/auth                      	| UserController.authenticate()        	|
| GET    	| /v1/user/                          	| UserController.currentUser()         	|
| PUT    	| /v1/user/                          	| UserController.update()              	|
| DELETE 	| /v1/user/                          	| UserController.delete()              	|
| GET    	| /                                  	| VersionController.getRoutes()        	|
