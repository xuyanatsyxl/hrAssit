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
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;
import org.infotechdept.hr.kq.service.AdcShiftApplyService;
import org.infotechdept.hr.kq.service.AdcShiftSchedulingService;
import org.infotechdept.hr.kq.service.AdcShiftService;

import com.hr.xl.system.utils.HRUtils;

public class AdcShiftAction extends BaseAction {

	private AdcShiftService adcShiftService = (AdcShiftService) super.getService("adcShiftService");
	private AdcShiftApplyService adcShiftApplyService = (AdcShiftApplyService) super.getService("adcShiftApplyService");
	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	private AdcShiftSchedulingService adcShiftSchedulingService = (AdcShiftSchedulingService) super.getService("adcShiftSchedulingService");

	public ActionForward adcShiftInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("manageAdcShiftView");
	}

	public ActionForward queryAdcShiftItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		List items = g4Reader.queryForPage("AdcShift.queryAdcShiftItemForManage", dto);
		for (int i = 0; i < items.size(); i++) {
			Dto dto2 = (BaseDto) items.get(i);
			dto2.put("entry_time", HRUtils.IntdatetimeToStrDateTime(dto2.getAsString("entry_time")));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShift.queryAdcShiftItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveAdcShiftItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("entry_time", G4Utils.getCurrentTimeAsNumber());
		inDto.put("entry_person", getSessionContainer(request).getUserInfo().getUserid());
		Dto outDto = adcShiftService.saveAdcShiftItem(inDto);
		setOkTipMsg("班次新建成功！", response);
		return mapping.findForward(null);
	}

	public ActionForward updateAdcShiftItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("entry_time", G4Utils.getCurrentTimeAsNumber());
		inDto.put("entry_person", getSessionContainer(request).getUserInfo().getUserid());
		Dto outDto = adcShiftService.updateAdcShiftItem(inDto);
		setOkTipMsg("班次更新成功！", response);
		return mapping.findForward(null);
	}

	public ActionForward deleteAdcShiftItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			Dto outDto = adcShiftService.deleteAdcShiftItem(inDto);
			setOkTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}

	public ActionForward saveAdcShiftDetailItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = adcShiftService.saveAdcShiftDetailItem(inDto);
		setOkTipMsg("明细班次新建成功！", response);
		return mapping.findForward(null);
	}

	public ActionForward updateAdcShiftDetailItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = adcShiftService.updateAdcShiftDetailItem(inDto);
		setOkTipMsg("明细班次更新成功！", response);
		return mapping.findForward(null);
	}

	public ActionForward deleteAdcShiftDetailItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			Dto outDto = adcShiftService.deleteAdcShiftDetailItem(inDto);
			setOkTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}

	public ActionForward queryAdcShiftDetailItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List items = g4Reader.queryForPage("AdcShift.queryAdcShiftDetailItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShift.queryAdcShiftDetailItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/*
	 * 班次应用初始化
	 */
	public ActionForward manageAdcShiftApplyInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		String range = request.getParameter("range");
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("manageAdcShiftApply" + range + "View");
	}

	public ActionForward queryAdcShiftApplyItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		List items = g4Reader.queryForPage("AdcShiftApply.queryAdcShiftApplyItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftApply.queryAdcShiftApplyItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward adcShiftDetailInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String shift_id = request.getParameter("shift_id");
		super.setSessionAttribute(request, "shift_id", shift_id);
		return mapping.findForward("adcShiftDetailView");
	}

	public ActionForward adcShiftSchedulingInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		return mapping.findForward("manageAdcShiftSchedulingView");
	}

	/*
	 * 填充各种combo数据
	 */
	public ActionForward queryAdcShiftItemForCombo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		} else {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}

		List items = g4Reader.queryForList("AdcShift.queryAdcShiftItemForCombo", dto);
		String jsonString = JsonHelper.encodeObject2Json(items);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryAdcShiftDetailItemForCombo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List items = g4Reader.queryForPage("AdcShift.queryAdcShiftDetailItemForCombo", dto);
		String jsonString = JsonHelper.encodeObject2Json(items);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/*
	 * 保存班次应用信息
	 */
	public ActionForward saveAdcShiftApplyItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = adcShiftApplyService.saveAdcShiftApplyItem(inDto);
		setOkTipMsg("班次应用新建成功！", response);
		return mapping.findForward(null);
	}

	/*
	 * 删除班次应用信息
	 */
	public ActionForward deleteAdcShiftApplyItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			Dto outDto = adcShiftApplyService.deleteAdcShiftApplyItem(inDto);
			setOkTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}
}
