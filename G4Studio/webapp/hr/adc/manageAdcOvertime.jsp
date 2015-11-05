<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<G4Studio:html title="加班申请单">
<G4Studio:ext.codeRender fields="RPT_STATE"/>
<G4Studio:ext.codeStore fields="RPT_STATE"/>
<G4Studio:import src="/hr/adc/js/manageAdcOvertime.js"/>
<G4Studio:ext.myux uxType="headgroup" />
<G4Studio:body>
<G4Studio:div key="deptTreeDiv"></G4Studio:div>
</G4Studio:body>
<G4Studio:script>
   var root_deptid = '<G4Studio:out key="rootDeptid" scope="request"/>';
   var root_deptname = '<G4Studio:out key="rootDeptname" scope="request"/>';
   var login_account = '<G4Studio:out key="login_account" scope="request"/>';
</G4Studio:script>
</G4Studio:html>