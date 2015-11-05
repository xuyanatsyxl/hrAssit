<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<G4Studio:html title="报表预览" urlSecurity2="false">
<G4Studio:body>
	<object width="100%" height="100%">
		<param name="movie" value="flash/jasperreports-flash-4.0.0.swf" />
		<embed src="flash/jasperreports-flash-4.0.0.swf"
			FlashVars="jrpxml=servlets/xml4swf?&fetchSize=3" width="100%"
			height="100%">
		</embed>
	</object>
</G4Studio:body>
</G4Studio:html>