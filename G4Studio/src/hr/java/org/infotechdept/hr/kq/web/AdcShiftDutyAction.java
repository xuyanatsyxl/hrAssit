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
import org.g4studio.core.web.report.excel.ExcelReader;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;
import org.infotechdept.hr.kq.service.AdcShiftDutyService;

import com.hr.xl.system.utils.HRUtils;

public class AdcShiftDutyAction extends BaseAction{

	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	private AdcShiftDutyService adcShiftDutyService = (AdcShiftDutyService) super.getService("adcShiftDutyService");
	
	/**
	 * 初始化
	 */
	public ActionForward adcShiftDutyInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("manageAdcShiftDutyView");
	}
	
	/**
	 * 初始化明细表
	 */
	public ActionForward adcShiftDutyQueryInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("queryAdcShiftDutyView");
	}	
	
	/**
	 * 查询明细表
	 */
	public ActionForward reportAdcShiftDuty(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		super.setSessionAttribute(request, "REPORTADCSHIFTDUTY_QUERYDTO", dto);
		List items = g4Reader.queryForPage("AdcShiftDuty.queryAdcShiftDutyReport", dto);
		for (int i = 0; i < items.size(); i++) {
			Dto dto2 = (BaseDto) items.get(i);
			dto2.put("dutydate", G4Utils.Date2String(dto2.getAsDate("dutydate"), "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftDuty.queryAdcShiftDutyReportForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 查询主表
	 */
	public ActionForward queryAdcShiftDutyItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		super.setSessionAttribute(request, "QUERYADCSHIFTDUTYITEM_QUERYDTO", dto);
		List items = g4Reader.queryForPage("AdcShiftDuty.queryAdcShiftDutyItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftDuty.queryAdcShiftDutyItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 查询明细表
	 */
	public ActionForward queryAdcShiftDutyDetailItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		super.setSessionAttribute(request, "QUERYADCSHIFTDUTYITEM_QUERYDTO", dto);
		List items = g4Reader.queryForPage("AdcShiftDuty.queryAdcShiftDutyDetailItemForManage", dto);
		for (int i = 0; i < items.size(); i++) {
			Dto dto2 = (BaseDto) items.get(i);
			dto2.put("dutydate", G4Utils.Date2String(dto2.getAsDate("dutydate"), "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftDuty.queryAdcShiftDutyDetailItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 初始化
	 */
	public ActionForward adcShiftDutyCheckInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("manageAdcShiftDutyCheckView");
	}
	
	/**
	 * Excel导入
	 */
	public ActionForward importExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm actionForm = (BaseActionForm) form;
		Dto dto = actionForm.getParamAsDto(request);
		FormFile theFile = actionForm.getTheFile();
		String metaData = "dutydate,code,name,shift_id";
		ExcelReader excelReader = new ExcelReader(metaData, theFile.getInputStream());
		List list = excelReader.read(3, 0);
		dto.setDefaultAList(list);
		dto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		dto.put("operate_time", G4Utils.getCurrentTimestamp());
		dto.put("rpt_state", "1");
		Dto outDto = adcShiftDutyService.importFromExcel(dto);
		if (outDto.getAsBoolean("success")) {
			setOkTipMsg("导入成功，单号[" + outDto.getAsString("msg") + "]", response);
		} else {
			setErrTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}
	
}
