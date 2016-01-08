<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<G4Studio:html title="排班明细表" >
<G4Studio:import src="/hr/adc/js/manageAdcShiftScheduling.js" />
<G4Studio:ext.codeRender fields="ENABLED,SHIFT_TYPE,COUNT"/>
<G4Studio:ext.codeStore fields="ENABLED,SHIFT_TYPE,COUNT"/>
<G4Studio:body>
<G4Studio:div key="deptTreeDiv"></G4Studio:div>
</G4Studio:body>
<G4Studio:script>
   var root_deptid = '<G4Studio:out key="rootDeptid" scope="request"/>';
   var root_deptname = '<G4Studio:out key="rootDeptname" scope="request"/>';
   var login_account = '<G4Studio:out key="login_account" scope="request"/>';
</G4Studio:script>
</G4Studio:html>