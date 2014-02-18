geonetwork-query
================

JavaScript function for making geonetwork XML queries

1. Create an html form
2. Fill the search_criteria object in the ```createRequestSearchCriteriaObject()``` function from the form elements or any other way you like
3. ```var search_criteria = createRequestSearchCriteriaObject();```
4. ```getMetadata(search_criteria);```
5. In the jquery post success add what you want exactly to do with the XML response

