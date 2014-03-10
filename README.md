FritWork (Zend - Facebook Application)
=======================

Introduction
------------
"FritWork" is a graphical representation of connections formed within a network of any given Facebook user. These representations help users navigate through their network and realize how people are connected within their network. A type of analysis possible only through a lot of browsing is presented in a user-friendly manner. This required understanding the concepts of graph API, FQL, Batch querying, User Authentication, PHP SDK, etc. specific to Facebook. 

For a sample version of FritWork visit http://www.shahsaurin.com/projects_demo/sigma-canvas/

The data visualization achieved is through front end sigma-js Library. The backend framework used is Zend. 

###Zend Framework


1) Module - \module\FritWork = A new module is added to the framework to maintain code related to this project. Necesarry changes made to config files to add this module and configure routing to point to the index action of the FritWork Controller.

2) Controller - \module\FritWork\src\Controller\FritWorokController = As per configured routing the index action would be invoked on calling visiting our domain. This controller routes the page into necessary direction based on the user log in status. 

3) Model - \module\FritWork\src\Model\Entity\ (Friend.php,Friendship.php) = 2 Model entity created namely Friend (information such as id, name and pic_url) and Friendship (to indicate if connection exists between two friends. Fields are source, target). Various get, set methods for the same.

4) View - \module\FritWork\view\frit-work\frit-work\ (enter.phtml,main.phtml) = 2 views created, one for when the user is logged in and one for the one when the user is logged out.

5) Service - \module\FritWork\src\Model\FacebookConnect.php = A service helper created to manage all the resources required for communicating with facebook and cache in order to conceil the complexity to the controller. Service manager used in order to obtain the service (object of the given class)

6) Caching = uid is the unique identifier associated with each Facebook friend entity. This ranges from numeric strings from 8 - 15 characters. As a requirement for the js implementation these had to mapped to continuous array of integers starting from 0. In order to do that, used the zend cache to map the uid to integer while retrieving the data of friends and while retireiving the data of friendships fetched the cached mapping data. The cached data deleted as soon as it serves it purpose also a 'ttl' (time to live) parameter set on the cached data for security reasons. 

(c) shahsaurin.com

