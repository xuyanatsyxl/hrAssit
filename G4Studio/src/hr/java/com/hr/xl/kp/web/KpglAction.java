package com.hr.xl.kp.web;

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

import com.hr.xl.kp.service.KpdaService;
import com.hr.xl.kp.service.KpdjService;

public class KpglAction extends BaseAction {

	private OrganizationService organizationService = (OrganizationService) super
			.getService("organizationService");

	private KpdaService kpdaService = (KpdaService) super
			.getService("kpdaService");

	private KpdjService kpdjService = (KpdjService) super
			.getService("kpdjService");

	public ActionForward kpdaInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo()
				.getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("manageKpdaView");
	}

	public ActionForward kpdjInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo()
				.getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("manageKpdjView");
	}

	public ActionForward queryKpdasForManage(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo()
					.getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}

		List kpdaList = g4Reader.queryForPage("KPDA.queryKpdasForManager", dto);
		for (int i = 0; i < kpdaList.size(); i++) {
			Dto dto2 = (BaseDto) kpdaList.get(i);
			dto2.put("jdrq", G4Utils.stringToDate(dto2.getAsString("jdrq"),
					"yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject(
				"KPDA.queryKpdasForManagerForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(kpdaList, pageCount,
				G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveKpdaItem(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("jdrq", G4Utils.getCurrentTime("yyyyMMdd"));
		inDto.put("jdr", getSessionContainer(request).getUserInfo().getUserid());
		Dto outDto = kpdaService.saveKpdaItem(inDto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward deleteKpdaItems(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			Dto outDto = kpdaService.deleteKpdaItems(inDto);
			setOkTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}

	public ActionForward updateKpdaItem(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		if (!isDemoMode(response)) {
			kpdaService.updateKpdaItem(inDto);
			setOkTipMsg("用户数据修改成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward queryKpdaMxForManage(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);

		List kpdaMxList = g4Reader.queryForPage("KPDA.queryKpdaMxForManager",
				dto);

		Integer pageCount = (Integer) g4Reader.queryForObject(
				"KPDA.queryKpdaMxForManagerForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(kpdaMxList,
				pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveKpdjItem(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("jdrq", G4Utils.getCurrentTime("yyyyMMdd"));
		inDto.put("jdr", getSessionContainer(request).getUserInfo().getUserid());
		Dto outDto = kpdjService.saveKpdjItem(inDto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}
}
