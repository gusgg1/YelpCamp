## YelpCamp 

### This is a site that I built with Express and EJS on the backend and Bootstrap 4 on the frondend.

#### Features
* Built with Bootstrap 4
* Site has user Authentication and Authorization
  * There is the role of administrator for the users with the admin credential
* User can create an account to place a campground with additional information about it.
  * there is a search bar in place to search a specific campground.
  * pagination has been added to the home page, displaying only 8 campgrounds per page. 
  * User can chose to use an URL or local image for the campground.
  * User can edit his created campground.  
* Users can add comments to each campground.
  * users can also edit their comments.
  * comments and campgrounds have both a timestamp.
  * there are two ways to add comments.
  * after a comment has been made or edited the user is redirected to the comment section of the page.
* Users have a profile page.
  * by clicking on a username any user can check others users profile page.
  * profile page shows list of campgrounds created by the user.
  * profile page shows moment of membership of user.
  * profile page displays user image, if user did not upload his own avatar a default one will be displayed instead.
* If user forgot his password, user can receive a token in his mailbox with expiration time to change his password.
* The app uses flash messages to notify user of successful or unsuccessful actions.
* If the name of a campground is too large, it will be shorten and a tooltip will display the full name when hover over the title.
* User has the option to rate the campground when adding a comment to any campground.
* If e-mail address is not properly formatted, real time validation will be displayed on the frontend. 
  * On the backend the form won't submit until e-mail address is of proper format.    

#### Features to come
* Google maps automatic geolocation
