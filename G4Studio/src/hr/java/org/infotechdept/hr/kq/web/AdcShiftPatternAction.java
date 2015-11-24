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
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;
import org.infotechdept.hr.kq.service.AdcShiftPatternService;

public class AdcShiftPatternAction extends BaseAction {

	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	private AdcShiftPatternService adcShiftPatternService = (AdcShiftPatternService) super.getService("adcShiftPatternService");

	public ActionForward adcShiftPatternInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		return mapping.findForward("manageAdcShiftPatternView");
	}

	public ActionForward queryAdcShiftPatternItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		List items = g4Reader.queryForPage("AdcShiftPattern.queryAdcShiftPatternItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftPattern.queryAdcShiftPatternItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryAdcShiftPatternDetailItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List items = g4Reader.queryForPage("AdcShiftPattern.queryAdcShiftPatternDetailItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftPattern.queryAdcShiftPatternDetailItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveAdcShiftPatternItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List list = aForm.getGridDirtyData(request);
		inDto.put("operate_time", G4Utils.getCurrentTime());
		inDto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		inDto.setDefaultAList(list);
		Dto outDto = adcShiftPatternService.saveAdcShiftPatternItem(inDto);
		setOkTipMsg("规律班次新建成功！", response);
		return mapping.findForward(null);
	}

	public ActionForward deleteAdcShiftPatternItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			Dto outDto = adcShiftPatternService.deleteAdcShiftPatternItem(inDto);
			setOkTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}

	public ActionForward updateAdcShiftPatternItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List list = aForm.getGridDirtyData(request);
		inDto.put("operateime", G4Utils.getCurrentTime());
		inDto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		inDto.setDefaultAList(list);
		Dto outDto = adcShiftPatternService.updateAdcShiftPatternItem(inDto);
		setOkTipMsg("规律班次更新成功！", response);
		return mapping.findForward(null);
	}
}
