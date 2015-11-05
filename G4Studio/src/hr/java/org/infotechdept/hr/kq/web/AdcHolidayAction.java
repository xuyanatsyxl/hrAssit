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
import org.infotechdept.hr.kq.service.AdcHolidayService;

public class AdcHolidayAction extends BaseAction {

	private AdcHolidayService adcHolidayService = (AdcHolidayService) getService("adcHolidayService");

	public ActionForward adcHolidayManageInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("manageAdcHolidayView");
	}

	/**
	 * 查询节日列表
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryAdcHolidayItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List itemList = g4Reader.queryForPage("AdcHoliday.queryAdcHolidayForManage", inDto);
		Integer totalCount = (Integer) g4Reader.queryForObject("AdcHoliday.queryAdcHolidayForManageForPageCount", inDto);
		String jsonStrList = JsonHelper.encodeList2PageJson(itemList, totalCount, G4Constants.FORMAT_Date);
		write(jsonStrList, response);
		return mapping.findForward(null);
	}

	/**
	 * 保存节日
	 * 
	 * @param
	 * @return
	 */
	public ActionForward saveAdcHolidayItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List aList = aForm.getGridDirtyData(request);
		inDto.setDefaultAList(aList);
		adcHolidayService.saveAdcHolidayItem(inDto);
		this.setOkTipMsg("节日信息保存成功！", response);
		return mapping.findForward(null);
	}

	/**
	 * 删除节日
	 * 
	 * @param
	 * @return
	 */
	public ActionForward deleteAdcHolidayItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			adcHolidayService.deleteAdcHolidayItem(inDto);
			setOkTipMsg("节日数据删除成功", response);
		}
		return mapping.findForward(null);
	}

	/**
	 * 修改节日
	 * 
	 * @param
	 * @return
	 */
	public ActionForward updateAdcHolidayItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List aList = aForm.getGridDirtyData(request);
		inDto.setDefaultAList(aList);
		if (!isDemoMode(response)) {
			adcHolidayService.updateAdcHolidayItem(inDto);
			setOkTipMsg("数据修改成功", response);
		}
		return mapping.findForward(null);
	}

	/**
	 * 查询节日明细
	 */
	public ActionForward queryAdcHolidayDetailItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List itemList = g4Reader.queryForPage("AdcHoliday.queryAdcHolidayDetailItemForManage", inDto);
		Integer totalCount = (Integer) g4Reader.queryForObject("AdcHoliday.queryAdcHolidayDetailItemForManageForPageCount", inDto);
		String jsonStrList = JsonHelper.encodeList2PageJson(itemList, totalCount, G4Constants.FORMAT_Date);
		write(jsonStrList, response);
		return mapping.findForward(null);
	}
}
