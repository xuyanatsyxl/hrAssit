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
import org.infotechdept.hr.kq.service.AdcShiftRecordService;

public class AdcShiftRecordAction extends BaseAction {

	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	private AdcShiftRecordService adcShiftRecordService = (AdcShiftRecordService) super.getService("adcShiftRecordService");

	public ActionForward adcShiftRecordInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("manageAdcShiftRecordView");
	}

	public ActionForward queryAdcShiftRecordItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		List items = g4Reader.queryForPage("AdcShiftRecord.queryAdcShiftRecordItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftRecord.queryAdcShiftRecordItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveAdcShiftRecordItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List list = aForm.getGridDirtyData(request);
		inDto.put("operate_time", G4Utils.getCurrentTime());
		inDto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		Dto outDto = adcShiftRecordService.saveAdcShiftRecordItem(inDto);
		setOkTipMsg("排班成功，后台生成排班表需要一段时间，请稍侯！", response);
		return mapping.findForward(null);
	}

	public ActionForward deleteAdcShiftRecordItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			Dto outDto = adcShiftRecordService.deleteAdcShiftRecordItem(inDto);
			setOkTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}

	public ActionForward updateAdcShiftRecordItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List list = aForm.getGridDirtyData(request);
		inDto.put("operateime", G4Utils.getCurrentTime());
		inDto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		inDto.setDefaultAList(list);
		Dto outDto = adcShiftRecordService.updateAdcShiftRecordItem(inDto);
		setOkTipMsg("排班数据更新成功！", response);
		return mapping.findForward(null);
	}

	/**
	 * 获得部门分组数据
	 */
}
