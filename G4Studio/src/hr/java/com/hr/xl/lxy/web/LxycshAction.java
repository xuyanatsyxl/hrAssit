package com.hr.xl.lxy.web;

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

import com.hr.xl.lxy.service.LxycshService;

public class LxycshAction extends BaseAction {
	private OrganizationService organizationService = (OrganizationService) super
			.getService("organizationService");
	private LxycshService lxycshservice = (LxycshService) super
			.getService("lxycshService");

	public ActionForward lxyxjwhInit(ActionMapping mapping, ActionForm form,
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
		return mapping.findForward("lxyxjwhInit");
	}

	public ActionForward queryLxybdjlxj(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		dto.put("bdlx", "4");
		List lxyList = g4Reader.queryForPage("LXYBDJL.queryLxybdjlForManage",
				dto);
		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);
			dto2.put("xhqxjrq", G4Utils.stringToDate(
					dto2.getAsString("xhqxjrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject(
				"LXYBDJL.queryLxybdjlForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount,
				G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward savelxyxjwhItem(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aform = (BaseActionForm) form;
		Dto dto = aform.getParamAsDto(request);
		String userid = super.getSessionContainer(request).getUserInfo()
				.getUserid();
		dto.put("czy", userid);
		dto.put("bz", "历史星级维护！");
		dto.put("czsj", G4Utils.Date2String(G4Utils.getCurrentTimestamp(),
				"yyyyMMddHHmmss"));
		dto.put("xhqxjrq",
				G4Utils.Date2String(dto.getAsDate("xhqxjrq"), "yyyyMMdd"));
		Dto outDto = lxycshservice.savelxyxjwhItem(dto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward deletelxyxjwh(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aform = (BaseActionForm) form;
		Dto dto = aform.getParamAsDto(request);
		Dto outDto = lxycshservice.deletelxyxjwh(dto);

		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

}
