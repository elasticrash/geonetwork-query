function createRequestSearchCriteriaObject() {
	var dateFrom = new Date();
	var dateTo = new Date();


	var search_criteria = {};

	search_criteria = {
		title : "",
		abstracts : "",
		resourceidentifier : "",
		type : "",
		keyword : "",
		topiccategory : "",
		from : dateFrom,
		to : dateTo,
		calendartype :"",
		organisationname : "",
		responsiblepartyrole : "",
		conditionapplyingtoaccessanduse : "",
		accessconstraints :"",
		lineage : "",
		specificationtitle :"",
		denominator : "",
		distancevalue : "",
		distanceuom : "",
		degree : "",
		bbox : map.getExtent(),                                              // new OpenLayers.Map
		tight : false,                                                         // false:PropertyIsLike true:PropertyIsEqualTo
		search_request_method : "advance",                                    // "or simple"
		server: 'http://localhost:8080/geonetwork/srv/eng/csw?service=CSW',  // geonetwork url
		outputschema: 'outputSchema="http://www.isotc211.org/2005/gmd"',
		start: 0,                                                           //for paging purposes
		limit: 25                                                           //limit results for paging purposes
	};

	return search_criteria;
}

function getMetadata(search_criteria)
{
var xmlreq = chooseXMLRequest(search_criteria);

			$.ajax({
				url : 'http://localhost:8080/geonetwork/srv/eng/csw?service=CSW',
				data : xmlreq,
				type : 'POST',
				contentType : "application/xml",
				dataType : "text",
				success : function(data) {
					xml_clean = xmlCleaner(data); //clean returned xml schema so you will have a 'normal' looking xml
				},
				error : function(xhr, ajaxOptions, thrownError) {
					alert(xhr.status);
					alert(thrownError);
				}
			});
}

function chooseXMLRequest(search_criteria) {
	var request;
	if (search_criteria.search_request_method == "simple") {
		request = createSimpleXMLRequest(search_criteria);
	}
	if (search_criteria.search_request_method == "advance") {
		request = createAdvancedRequest(search_criteria);
	}
	return request;
}

function createSimpleXMLRequest(search_criteria) {
var elementSetName = "brief";

var request = '<?xml version="1.0"?><csw:GetRecords xmlns:ogc="http://www.opengis.net/ogc" xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" xmlns:gmd="http://www.isotc211.org/2005/gmd" service="CSW" version="2.0.2" resultType="results" startPosition="' + search_criteria.start + '" maxRecords="' + search_criteria.limit + '" SRS="EPSG:4326" ' + search_criteria.outputSchema + '> <csw:Query typeNames="gmd:MD_Metadata" ><csw:ElementSetName typeNames="gmd:MD_Metadata">' + elementSetName + '</csw:ElementSetName><csw:Constraint version="1.1.0"><ogc:Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:And><ogc:PropertyIsLike wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>AnyText</ogc:PropertyName><ogc:Literal>*' + search_criteria.keyword + '*</ogc:Literal></ogc:PropertyIsLike><ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:type</ogc:PropertyName><ogc:Literal>dataset</ogc:Literal></ogc:PropertyIsEqualTo></ogc:And></ogc:Filter></csw:Constraint></csw:Query></csw:GetRecords>';

	return request;
}

function createAdvancedRequest(search_criteria) {
	var propertyType;
	var star;
	if (tight_search === false) {
		propertyType = "PropertyIsLike";
		star = "*";
	}
	if (tight_search === true) {
		propertyType = "PropertyIsEqualTo";
		star = "";
	}

	var count = 0;
	var property = "";

	if (search_criteria.title !== null && search_criteria.title !== "" && search_criteria.title !== "undefined") {
		property += '<ogc:' + propertyType + ' wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:title</ogc:PropertyName><ogc:Literal>' + star + search_criteria.title + star + '</ogc:Literal></ogc:' + propertyType + '>';
		count++;
	}

	if (search_criteria.abstracts !== null && search_criteria.abstracts !== "" && search_criteria.abstracts !== "undefined") {
		property += '<ogc:' + propertyType + ' wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:abstracts</ogc:PropertyName><ogc:Literal>' + star + search_criteria.abstracts + star + '</ogc:Literal></ogc:' + propertyType + '>';
		count++;
	}

	if (search_criteria.keyword !== null && search_criteria.keyword !== "" && search_criteria.keyword !== "undefined") {
		property += '<ogc:' + propertyType + ' wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:subject</ogc:PropertyName><ogc:Literal>' + star + search_criteria.keyword + star + '</ogc:Literal></ogc:' + propertyType + '>';
		count++;
	}

	if (search_criteria.accessconstraints !== null && search_criteria.accessconstraints !== "" && search_criteria.accessconstraints !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:AccessConstraints</ogc:PropertyName><ogc:Literal>' + search_criteria.accessconstraints + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.resourceidentifier !== null && search_criteria.resourceidentifier !== "" && search_criteria.resourceidentifier !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:ResourceIdentifier</ogc:PropertyName><ogc:Literal>' + search_criteria.resourceidentifier + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.calendartype !== null && search_criteria.calendartype !== "" && search_criteria.calendartype !== "undefined" && search_criteria.from !== "" && search_criteria.to !== "" && search_criteria.from !== "undefined" && search_criteria.to !== "undefined") {
		switch(search_criteria.calendartype) {
			case "tempExtentDate":
				property += '<ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyName>apiso:TempExtent_begin</ogc:PropertyName><ogc:Literal>' + search_criteria.from + '</ogc:Literal></ogc:PropertyIsGreaterThanOrEqualTo>';
				property += '<ogc:PropertyIsLessThanOrEqualTo><ogc:PropertyName>apiso:TempExtent_end</ogc:PropertyName><ogc:Literal>' + search_criteria.to + '</ogc:Literal></ogc:PropertyIsLessThanOrEqualTo>';
				count++;
				break;

			case "creationDate":
				property += '<ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyName>apiso:CreationDate</ogc:PropertyName><ogc:Literal>' + search_criteria.from + '</ogc:Literal></ogc:PropertyIsGreaterThanOrEqualTo>';
				property += '<ogc:PropertyIsLessThanOrEqualTo><ogc:PropertyName>apiso:CreationDate</ogc:PropertyName><ogc:Literal>' + search_criteria.to + '</ogc:Literal></ogc:PropertyIsLessThanOrEqualTo>';
				count++;
				break;

			case "revisionDate":
				property += '<ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyName>apiso:RevisionDate</ogc:PropertyName><ogc:Literal>' + search_criteria.from + '</ogc:Literal></ogc:PropertyIsGreaterThanOrEqualTo>';
				property += '<ogc:PropertyIsLessThanOrEqualTo><ogc:PropertyName>apiso:RevisionDate</ogc:PropertyName><ogc:Literal>' + search_criteria.to + '</ogc:Literal></ogc:PropertyIsLessThanOrEqualTo>';
				count++;
				break;

			case "publicationDate":
				property += '<ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyName>apiso:PublicationDate</ogc:PropertyName><ogc:Literal>' + search_criteria.from + '</ogc:Literal></ogc:PropertyIsGreaterThanOrEqualTo>';
				property += '<ogc:PropertyIsLessThanOrEqualTo><ogc:PropertyName>apiso:PublicationDate</ogc:PropertyName><ogc:Literal>' + search_criteria.to + '</ogc:Literal></ogc:PropertyIsLessThanOrEqualTo>';
				count++;
				break;
		}
	}

	if (search_criteria.topiccategory !== null && search_criteria.topiccategory !== "" && search_criteria.topiccategory !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:topicCategory</ogc:PropertyName><ogc:Literal>' + search_criteria.topiccategory + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.type !== null && search_criteria.type !== "" && search_criteria.type !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:type</ogc:PropertyName><ogc:Literal>' + search_criteria.type + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.organisationname !== null && search_criteria.organisationname !== "" && search_criteria.organisationname !== "undefined") {
		property += '<ogc:' + propertyType + ' wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:OrganisationName</ogc:PropertyName><ogc:Literal>' + star + search_criteria.organisationname + star + '</ogc:Literal></ogc:' + propertyType + '>';
		count++;
	}

	if (search_criteria.responsiblepartyrole !== null && search_criteria.responsiblepartyrole !== "" && search_criteria.responsiblepartyrole !== "undefined") {
		property += '<ogc:PropertyIsEqualTo><ogc:PropertyName>apiso:ResponsiblePartyRole</ogc:PropertyName><ogc:Literal>' + search_criteria.responsiblepartyrole + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.conditionapplyingtoaccessanduse !== null && search_criteria.conditionapplyingtoaccessanduse !== "" && search_criteria.conditionapplyingtoaccessanduse !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:ConditionApplyingToAccessAndUse</ogc:PropertyName><ogc:Literal>' + search_criteria.conditionapplyingtoaccessanduse + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.accessconstraints !== null && search_criteria.accessconstraints !== "" && search_criteria.accessconstraints !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:AccessConstraints</ogc:PropertyName><ogc:Literal>' + search_criteria.accessconstraints + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.lineage !== null && search_criteria.lineage !== "" && search_criteria.lineage !== "undefined") {
		property += '<ogc:' + propertyType + ' wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:Lineage</ogc:PropertyName><ogc:Literal>' + star + search_criteria.lineage + star + '</ogc:Literal></ogc:' + propertyType + '>';
		count++;
	}

	if (search_criteria.specificationtitle !== null && search_criteria.specificationtitle !== "" && search_criteria.specificationtitle !== "undefined") {
		property += '<ogc:' + propertyType + ' wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:SpecificationTitle</ogc:PropertyName><ogc:Literal>' + search_criteria.specificationtitle + '</ogc:Literal></ogc:' + propertyType + '>';
		count++;
	}

	if (search_criteria.denominator !== null && search_criteria.denominator !== "" && search_criteria.denominator !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:Denominator</ogc:PropertyName><ogc:Literal>' + search_criteria.denominator + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.distancevalue !== null && search_criteria.distancevalue !== "" && search_criteria.distancevalue !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:DistanceValue</ogc:PropertyName><ogc:Literal>' + search_criteria.distancevalue + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.distanceuom !== null && search_criteria.distanceuom !== "" && search_criteria.distanceuom !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:DistanceUOM</ogc:PropertyName><ogc:Literal>' + search_criteria.distanceuom + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.degree !== null && search_criteria.degree !== "" && search_criteria.degree !== "undefined") {
		property += '<ogc:PropertyIsEqualTo wildCard="*" singleChar="_" escapeChar="\"><ogc:PropertyName>apiso:Degree</ogc:PropertyName><ogc:Literal>' + search_criteria.degree + '</ogc:Literal></ogc:PropertyIsEqualTo>';
		count++;
	}

	if (search_criteria.bbox !== null && search_criteria.bbox !== "" && search_criteria.bbox !== "undefined") {
		var bbox = search_criteria.bbox.split(",");

		property += '<ogc:BBOX><ogc:PropertyName>ows:BoundingBox</ogc:PropertyName><gml:Envelope><gml:lowerCorner>' + bbox[0] + ' ' + bbox[1] + '</gml:lowerCorner> <gml:upperCorner>' + bbox[2] + ' ' + bbox[3] + '</gml:upperCorner> </gml:Envelope></ogc:BBOX>';
		count++;
	}

	var constaringBegin = "";
	var constaringEnd = "";
	var request;
	if (count > 1) {
		constaringBegin = "<ogc:And>";
		constaringEnd = "</ogc:And>";
	}

	if (count > 0) {
		request = '<?xml version="1.0"?><csw:GetRecords xmlns:ogc="http://www.opengis.net/ogc" xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" xmlns:gmd="http://www.isotc211.org/2005/gmd" service="CSW" version="2.0.2" resultType="results" startPosition="' + search_criteria.start + '" maxRecords="' + limit + '" SRS="EPSG:4326" ' + search_criteria.outputSchema + '><csw:Query typeNames="gmd:MD_Metadata" ><csw:ElementSetName typeNames="gmd:MD_Metadata">full</csw:ElementSetName><csw:Constraint version="1.1.0"><ogc:Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">' + constaringBegin + property + constaringEnd + '</ogc:Filter></csw:Constraint></csw:Query></csw:GetRecords>';
	}

	return request;
}
