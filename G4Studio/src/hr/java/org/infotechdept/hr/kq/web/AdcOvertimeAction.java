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
import org.g4studio.core.mvc.xstruts.upload.FormFile;
import org.g4studio.core.util.G4Constants;
import org.g4studio.core.util.G4Utils;
import org.g4studio.core.web.report.excel.ExcelExporter;
import org.g4studio.core.web.report.excel.ExcelReader;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;
import org.infotechdept.hr.kq.service.AdcOvertimeService;

public class AdcOvertimeAction extends BaseAction {

	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");

	private AdcOvertimeService adcOvertimeService = (AdcOvertimeService) super.getService("adcOvertimeService");

	/**
	 * 查询初始化
	 */
	public ActionForward adcOvertimeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("manageAdcOvertimeView");
	}

	/**
	 * 查询
	 */
	public ActionForward queryAdcOvertimeItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}
		super.setSessionAttribute(request, "QUERYADCOVERTIMEITEM_QUERYDTO", dto);
		List items = g4Reader.queryForPage("AdcOvertime.queryAdcOvertimeItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcOvertime.queryAdcOvertimeItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/**
	 * 新建
	 */
	public ActionForward saveAdcOvertimeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		inDto.put("operate_time", G4Utils.getCurrentTimestamp());
		inDto.put("rpt_state", "1");
		List aList = aForm.getGridDirtyData(request);
		inDto.setDefaultAList(aList);
		adcOvertimeService.saveAdcOvertimeItem(inDto);
		setOkTipMsg("加班表保存成功！", response);
		return mapping.findForward(null);
	}

	/**
	 * 查询明细表
	 */
	public ActionForward queryAdcOvertimeDetailItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List items = g4Reader.queryForPage("AdcOvertime.queryAdcOvertimeDetailItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcOvertime.queryAdcOvertimeDetailItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/**
	 * 删除
	 */
	public ActionForward deleteAdcOvertimeItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			adcOvertimeService.deleteAdcOvertimeItems(inDto);
			setOkTipMsg("加班数据删除成功", response);
		}
		return mapping.findForward(null);
	}

	/**
	 * 更新
	 */
	public ActionForward updateAdcOvertimeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List aList = aForm.getGridDirtyData(request);
		inDto.setDefaultAList(aList);
		inDto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		inDto.put("operate_time", G4Utils.getCurrentTimestamp());
		if (!isDemoMode(response)) {
			adcOvertimeService.updateAdcOvertimeItem(inDto);
			setOkTipMsg("加班数据修改成功", response);
		}
		return mapping.findForward(null);
	}

	/**
	 * Excel导入
	 */
	public ActionForward importExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm actionForm = (BaseActionForm) form;
		Dto dto = actionForm.getParamAsDto(request);
		FormFile theFile = actionForm.getTheFile();
		String metaData = "id,code,name,days_normal,hours_normal,days_weekend,hours_weekend,days_holiday,hours_holiday";
		ExcelReader excelReader = new ExcelReader(metaData, theFile.getInputStream());
		List list = excelReader.read(4, 0);
		dto.setDefaultAList(list);
		dto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		dto.put("operate_time", G4Utils.getCurrentTimestamp());
		dto.put("rpt_state", "1");
		Dto outDto = adcOvertimeService.importFromExcel(dto);
		if (outDto.getAsBoolean("success")) {
			setOkTipMsg("导入成功", response);
		} else {
			this.setErrTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}

	/**
	 * Excel空表导出
	 */
	public ActionForward exportExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm actionForm = (BaseActionForm) form;
		Dto dto = (BaseDto) super.getSessionAttribute(request, "QUERYADCOVERTIMEITEM_QUERYDTO");

		String deptid = dto.getAsString("deptid");
		List empls = g4Reader.queryForList("Deptempl.queryDeptemplItemForManage", dto);

		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "加班上报表");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());

		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/adc/overtimeReport.xls");
		excelExporter.setData(parametersDto, empls);
		excelExporter.setFilename(deptid + ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	/**
	 * 查询初始化
	 */
	public ActionForward adcOvertimeCheckInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		return mapping.findForward("manageAdcOvertimeForCheckView");
	}

	/**
	 * 查询
	 */
	public ActionForward queryAdcOvertimeItemForCheck(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		List items = g4Reader.queryForPage("AdcOvertime.queryAdcOvertimeItemForCheck", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcOvertime.queryAdcOvertimeItemForCheckForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/**
	 * 确认
	 */
	public ActionForward updateAdcOvertimeRptstate(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			adcOvertimeService.updateAdcOvertimeRptstate(inDto);
			setOkTipMsg("加班单据上报成功！", response);
		}
		return mapping.findForward(null);
	}
	
	/**
	 * 加班报表--分部门汇总表
	 */
	/**
	 * 初始化
	 */
	public ActionForward adcOvertimeSumInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("reportAdcOvertimeSumView");
	}
	
	/**
	 * 查询
	 */
	public ActionForward reportAdcOvertimeSum(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		super.setSessionAttribute(request, "QUERYADCOVERTIMESUM_QUERYDTO", dto);
		List items = g4Reader.queryForPage("AdcOvertime.queryAdcOvertimeSumItem", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcOvertime.queryAdcOvertimeSumItemForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * Excel导出
	 */
	public ActionForward exportSumExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm actionForm = (BaseActionForm) form;
		Dto dto = (BaseDto) super.getSessionAttribute(request, "QUERYADCOVERTIMESUM_QUERYDTO");

		String deptid = dto.getAsString("deptid");
		List items = g4Reader.queryForList("AdcOvertime.queryAdcOvertimeSumItem", dto);

		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "部门加班汇总表");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());

		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/adc/overtimeReportSum.xls");
		excelExporter.setData(parametersDto, items);
		excelExporter.setFilename(deptid + ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 加班报表--分部门明细表
	 */
	/**
	 * 初始化
	 */
	public ActionForward adcOvertimeDetailInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("reportAdcOvertimeDetailView");
	}
	
	/**
	 * 查询
	 */
	public ActionForward reportAdcOvertimeDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		super.setSessionAttribute(request, "QUERYADCOVERTIMEDETAIL_QUERYDTO", dto);
		List items = g4Reader.queryForPage("AdcOvertime.queryAdcOvertimeDetailItem", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcOvertime.queryAdcOvertimeDetailItemForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * Excel导出
	 */
	public ActionForward exportDetailExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm actionForm = (BaseActionForm) form;
		Dto dto = (BaseDto) super.getSessionAttribute(request, "QUERYADCOVERTIMESUM_QUERYDTO");

		String deptid = dto.getAsString("deptid");
		List items = g4Reader.queryForList("AdcOvertime.queryAdcOvertimeDetailItem", dto);

		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "部门加班明细表");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());

		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/adc/overtimeReportDetail.xls");
		excelExporter.setData(parametersDto, items);
		excelExporter.setFilename(deptid + ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}
}
