geonetwork-query
================

JavaScript function for making geonetwork XML queries

Step 1
Create a form
Step 2
Fill the search_criteria object in the createRequestSearchCriteriaObject() function from the form elements or any other way you like
Step 3
var search_criteria = createRequestSearchCriteriaObject();
getMetadata(search_criteria);
Step 4
In the jquery post success add what you want exactly to do with the XML response

