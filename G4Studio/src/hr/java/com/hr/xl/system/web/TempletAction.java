package com.hr.xl.system.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.g4studio.common.web.BaseAction;
import org.g4studio.common.web.BaseActionForm;
import org.g4studio.core.json.JsonHelper;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.mvc.xstruts.action.ActionForm;
import org.g4studio.core.mvc.xstruts.action.ActionForward;
import org.g4studio.core.mvc.xstruts.action.ActionMapping;

import com.hr.xl.system.service.TempletService;

public class TempletAction extends BaseAction {

	private TempletService templateService = (TempletService) super
			.getService("templetService");

	public ActionForward queryTempletForManage(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List userList = g4Reader.queryForPage("Templet.queryTempletsForManage",
				dto);
		Integer pageCount = (Integer) g4Reader.queryForObject(
				"Templet.queryTempletsForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(userList, pageCount,
				null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward templetInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("templetView");
	}
}
