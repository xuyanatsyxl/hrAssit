package org.infotechdept.hr.kq.web;

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

public class AdcAttendTypeAction extends BaseAction {

	public ActionForward manageAdcAttendTypeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("manageAdcAttendTypeView");
	}

	/**
	 * 查询首层
	 */
	public ActionForward queryAdcAttendTypeItemsForCombox(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List areaList = g4Reader.queryForList("AdcAttendType.queryAdcAttendTypeItemForManage", dto);
		String jsonString = JsonHelper.encodeObject2Json(areaList);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 查询考勤符号
	 */
	public ActionForward queryAdcAttendTypeSymbolForPaint(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List<Dto> areaList = g4Reader.queryForList("AdcAttendType.queryAdcAttendTypeItemForManage", dto);		
		String jsonString = JsonHelper.encodeObject2Json(areaList);
		write(jsonString, response);
		return mapping.findForward(null);
	}	
}
