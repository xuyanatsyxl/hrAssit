package org.infotechdept.hr.kq.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.g4studio.common.web.BaseAction;
import org.g4studio.common.web.BaseActionForm;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.mvc.xstruts.action.ActionForm;
import org.g4studio.core.mvc.xstruts.action.ActionForward;
import org.g4studio.core.mvc.xstruts.action.ActionMapping;
import org.g4studio.core.util.G4Utils;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;
import org.infotechdept.hr.kq.service.AdcShiftReportService;

public class AdcShiftReportAction extends BaseAction {

	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	private AdcShiftReportService adcShiftReportService = (AdcShiftReportService) super.getService("adcShiftReportService");

	/**
	 * 报表生成初始化
	 */
	public ActionForward makeAdcShiftReportInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		return mapping.findForward("makeAdcShiftReportView");
	}

	/**
	 * 生成报表
	 */
	public ActionForward makeAdcShiftReport(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("operate_time", G4Utils.getCurrentTime());
		inDto.put("operator", getSessionContainer(request).getUserInfo().getUserid());
		inDto.put("cascadeid", organizationService.queryCascadeidByDeptid(inDto.getAsInteger("deptid")));
		inDto.remove("deptid");
		Dto outDto = adcShiftReportService.makeAdcShiftReport(inDto);
		if (outDto.getAsBoolean("success")) {
			setOkTipMsg(outDto.getAsString("msg"), response);
		} else {
			setErrTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}

}
