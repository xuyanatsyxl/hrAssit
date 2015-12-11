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
import org.g4studio.core.util.G4Constants;
import org.g4studio.core.util.G4Utils;
import org.g4studio.core.web.report.excel.ExcelExporter;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;

public class AdcShiftMealsAction extends BaseAction{
	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	
	/**
	 * 明细查询初始化
	 */
	public ActionForward adcShiftMealsDetailInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("queryAdcShiftMealsDetailView");
	}
	
	/**
	 * 明细查询
	 */
	public ActionForward queryAdcShiftMealsDetailItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}		
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		List items = g4Reader.queryForPage("AdcShiftMeals.queryAdcShiftMealsDetailItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftMeals.queryAdcShiftMealsDetailItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 汇总查询初始化
	 */
	public ActionForward adcShiftMealsInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("queryAdcShiftMealsView");
	}
	
	/**
	 * 汇总查询
	 */
	public ActionForward queryAdcShiftMealsItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		super.setSessionAttribute(request, "QUERYADCSHIFTMEALSITEM_QUERYDTO", dto);
		List items = g4Reader.queryForPage("AdcShiftMeals.queryAdcShiftMealsItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftMeals.queryAdcShiftMealsItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 汇总数据导出到EXCEL
	 */
	public ActionForward exportExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm actionForm = (BaseActionForm) form;
		Dto dto = (BaseDto) super.getSessionAttribute(request, "QUERYADCSHIFTMEALSITEM_QUERYDTO");
		List empls = g4Reader.queryForList("AdcShiftMeals.queryAdcShiftMealsItemForManage", dto);
		String deptid = dto.getAsString("cascadeid");
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "食堂统计汇总表");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());

		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/adc/adcShiftMealsReport.xls");
		excelExporter.setData(parametersDto, empls);
		excelExporter.setFilename(deptid + ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 每日就餐请假汇总查询初始化
	 */
	public ActionForward adcMealsLeaveInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("queryAdcMealsLeaveView");
	}
	
	/**
	 * 每日就餐请假汇总查询
	 */
	public ActionForward queryAdcMealsLeave(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		List items = g4Reader.queryForPage("AdcShiftMeals.queryAdcMealsLeaveItemForManage", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, null, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 综合查询初始化
	 */
	public ActionForward queryAdcShiftMealsByDeptInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("queryAdcShiftMealsByDeptView");
	}
	
	/**
	 * 综合查询:汇总
	 */
	public ActionForward queryAdcShiftMealsByDept(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		super.setSessionAttribute(request, "QUERYADCSHIFTMEALSBYDEPT_QUERYDTO", dto);
		List items = g4Reader.queryForPage("AdcShiftMeals.queryAdcShiftMealsByDeptForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftMeals.queryAdcShiftMealsByDeptForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}	
	
	/**
	 * 综合查询:导出到EXCEL
	 */
	public ActionForward exportDeptExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm actionForm = (BaseActionForm) form;
		Dto dto = (BaseDto) super.getSessionAttribute(request, "QUERYADCSHIFTMEALSBYDEPT_QUERYDTO");
		List empls = g4Reader.queryForList("AdcShiftMeals.queryAdcShiftMealsByDeptForManage", dto);
		String deptid = dto.getAsString("cascadeid");
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "部门就餐统计汇总表");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());

		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/adc/adcShiftMealsDeptReport.xls");
		excelExporter.setData(parametersDto, empls);
		excelExporter.setFilename(deptid + ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}
}
