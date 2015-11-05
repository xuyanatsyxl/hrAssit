package com.hr.xl.nusoft.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.g4studio.common.dao.Reader;
import org.g4studio.common.web.BaseAction;
import org.g4studio.common.web.BaseActionForm;
import org.g4studio.core.json.JsonHelper;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.mvc.xstruts.action.ActionForm;
import org.g4studio.core.mvc.xstruts.action.ActionForward;
import org.g4studio.core.mvc.xstruts.action.ActionMapping;

import com.hr.xl.kq.service.CardService;

public class HrAction extends BaseAction {

	private CardService cardService = (CardService) super
			.getService("cardService");
	private Reader hrReader = (Reader) getService("hrReader");

	public ActionForward EmpCardManageInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("EmpCardManageView");
	}

	public ActionForward queryEmplFromNusoftForManage(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List emplList = hrReader.queryForPage("HR.queryHremplForManage", dto);
		Integer pageCount = (Integer) hrReader.queryForObject(
				"HR.queryHremplForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(emplList, pageCount,
				null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveEmpcardItem(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = cardService.saveEmpcardItem(inDto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}
}
