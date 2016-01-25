package org.infotechdept.hr.kq.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.g4studio.common.web.BaseAction;
import org.g4studio.common.web.BaseActionForm;
import org.g4studio.core.json.JsonHelper;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.mvc.xstruts.action.ActionForm;
import org.g4studio.core.mvc.xstruts.action.ActionForward;
import org.g4studio.core.mvc.xstruts.action.ActionMapping;
import org.g4studio.core.util.G4Utils;
import org.g4studio.core.web.report.excel.ExcelExporter;
import org.g4studio.core.web.report.jasper.ReportData;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;

public class AdcReportPersonMonthAction extends BaseAction {

	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");

	private String getfullDeptName(String deptid) {
		String resultStr = "";
		for (int i = 1; i <= deptid.length() / 3; i++) {
			String subDeptid = deptid.substring(0, 3 * i);
			if (G4Utils.isEmpty(subDeptid) || (subDeptid.equalsIgnoreCase("001"))) {
				continue;   
			}
			Dto dto = (BaseDto) g4Reader.queryForObject("EMPLOYEE.queryEadeptItemByDeptid", subDeptid);
			resultStr += "-" + dto.getAsString("deptname");
		}
		resultStr = resultStr.substring(1);
		return resultStr.trim();
	}

	/**
	 * 报表查询初始化
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward adcReportPersonMonthInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("queryAdcPersonMonthView");
	}

	/**
	 * 查询报表
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryAdcReportPersonMonthForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		} else {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		super.setSessionAttribute(request, "QUERYADCREPORTPERSONMONTH_QUERYDTO", dto);

		List items = g4Reader.queryForPage("AdcReportPersonMonth.queryAdcShiftMonthReportForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcReportPersonMonth.queryAdcShiftMonthReportForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/**
	 * 构造报表数据对象
	 */
	public ActionForward buildReportDataObject(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto inDto = (BaseDto) getSessionAttribute(request, "QUERYADCREPORTPERSONMONTH_QUERYDTO");
		Dto dto = new BaseDto();
		String strYm = inDto.getAsString("yearmonth");
		String cascadeid = inDto.getAsString("cascadeid");
		dto.put("reportTitle", strYm.substring(0, 4) + "年" + strYm.substring(4, 6) + "月考勤表");
		dto.put("jbr", getSessionContainer(request).getUserInfo().getUsername());
		dto.put("jbsj", G4Utils.getCurrentTime());
		dto.put("yearmonth", inDto.getAsString("yearmonth"));
		dto.put("deptname", getfullDeptName(cascadeid));
		List catalogList = g4Reader.queryForList("AdcReportPersonMonth.queryAdcShiftMonthReportForManage", inDto);
		for (int i = 0; i < catalogList.size(); i++) {
			Dto dto2 = (BaseDto) catalogList.get(i);
			dto2.put("sortno", (i + 1));
		}
		ReportData reportData = new ReportData();
		reportData.setParametersDto(dto);
		reportData.setFieldsList(catalogList);
		reportData.setReportFilePath("/report/jasper/hr/adcShiftReportMonth.jasper");
		getSessionContainer(request).setReportData("adcShiftReportMonth", reportData);
		return mapping.findForward(null);
	}
	
	/**
	 * Excel导出
	 */
	public ActionForward exportExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto inDto = (BaseDto) getSessionAttribute(request, "QUERYADCREPORTPERSONMONTH_QUERYDTO");
		Dto dto = new BaseDto();
		String strYm = inDto.getAsString("yearmonth");
		String cascadeid = inDto.getAsString("cascadeid");
		dto.put("yearmonth", inDto.getAsString("yearmonth"));
		List catalogList = g4Reader.queryForList("AdcReportPersonMonth.queryAdcShiftMonthReportForManage", inDto);
		for (int i = 0; i < catalogList.size(); i++) {
			Dto dto2 = (BaseDto) catalogList.get(i);
			dto2.put("sortno", (i + 1));
		}

		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", strYm.substring(0, 4) + "年" + strYm.substring(4, 6) + "月考勤表");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		parametersDto.put("deptname", "部门：" + getfullDeptName(cascadeid));
		
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/adc/adcShiftMonthReport.xls");
		excelExporter.setData(parametersDto, catalogList);
		excelExporter.setFilename(cascadeid + ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}	
}
