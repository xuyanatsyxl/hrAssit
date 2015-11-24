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
import org.infotechdept.hr.kq.service.AdcShiftBasicService;

public class AdcShiftBasicAction extends BaseAction {

	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	private AdcShiftBasicService adcShiftBasicService = (AdcShiftBasicService) super.getService("adcShiftBasicService");

	public ActionForward adcShiftBasicInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("manageAdcShiftBasicView");
	}

	public ActionForward queryAdcShiftBasicItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		List items = g4Reader.queryForPage("AdcShiftBasic.queryAdcShiftBasicItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftBasic.queryAdcShiftBasicItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveAdcShiftBasicItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("operate_time", G4Utils.getCurrentTime());
		inDto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		Dto outDto = adcShiftBasicService.saveAdcShiftBasicItem(inDto);
		setOkTipMsg("基本班次新建成功！", response);
		return mapping.findForward(null);
	}

	public ActionForward updateAdcShiftBasicItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("operateime", G4Utils.getCurrentTime());
		inDto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		Dto outDto = adcShiftBasicService.updateAdcShiftBasicItem(inDto);
		setOkTipMsg("基本班次更新成功！", response);
		return mapping.findForward(null);
	}

	public ActionForward deleteAdcShiftBasicItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			Dto outDto = adcShiftBasicService.deleteAdcShiftBasicItem(inDto);
			setOkTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}

	/**
	 * 查询表格列表
	 */
	public ActionForward queryAdcShiftBasicItemForList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);

		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		if (dto.getAsString("cascadeid").length() > 9) {
			dto.put("cascadeid", dto.getAsString("cascadeid").substring(0, 9));
		}
		List items = g4Reader.queryForPage("AdcShiftBasic.queryAdcShiftBasicItemForList", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftBasic.queryAdcShiftBasicItemForListForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
}
