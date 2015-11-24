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
import org.g4studio.core.util.G4Utils;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;
import org.infotechdept.hr.kq.service.AdcDinnerRoomService;
import org.infotechdept.hr.kq.service.AdcDinnerRoomUnitService;

public class AdcDinnerRoomAction extends BaseAction{
	
	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	private AdcDinnerRoomService adcDinnerRoomService = (AdcDinnerRoomService) super.getService("adcDinnerRoomService");
	private AdcDinnerRoomUnitService adcDinnerRoomUnitService = (AdcDinnerRoomUnitService)super.getService("adcDinnerRoomUnitService");
	
	/**
	 * 食堂管理初始化
	 */
	public ActionForward adcDinnerRoomInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("manageAdcDinnerRoomView");
	}
	
	
	/**
	 * 食堂单位管理初始化
	 */
	public ActionForward adcDinnerRoomUnitInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("manageAdcDinnerRoomUnitView");
	}
	
	/**
	 * 食堂查询
	 */
	public ActionForward queryAdcDinnerRoomItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		List items = g4Reader.queryForPage("AdcDinnerRoom.queryAdcDinnerRoomItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcDinnerRoom.queryAdcDinnerRoomItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 食堂新建
	 */
	public ActionForward saveAdcDinnerRoomItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		adcDinnerRoomService.saveAdcDinnerRoomItem(inDto);
		setOkTipMsg("食堂新建成功！", response);
		return mapping.findForward(null);
	}
	
	/**
	 * 食堂更新
	 */
	public ActionForward updateAdcDinnerRoomItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = adcDinnerRoomService.updateAdcDinnerRoomItem(inDto);
		setOkTipMsg("食堂信息更新成功！", response);
		return mapping.findForward(null);
	}
	
	/**
	 * 食堂删除
	 */
	public ActionForward deleteAdcDinnerRoomItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			adcDinnerRoomService.deleteAdcDinnerRoomItem(inDto);
			setOkTipMsg("食堂删除成功！", response);
		}
		return mapping.findForward(null);
	}
	
	/**
	 * 用户授权页面初始化:选择菜单
	 * 
	 * @param
	 * @return
	 */
	public ActionForward selectDkjInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("selectDkjTreeView");
	}
	

	public ActionForward saveDinnerRoom(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = adcDinnerRoomService.saveDinnerRoom(inDto);
		setOkTipMsg("食堂信息更新成功！", response);
		return mapping.findForward(null);
	}
	
	/**
	 * 查询就餐单位
	 */
	public ActionForward queryAdcDinnerRoomUnitItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		List items = g4Reader.queryForPage("AdcDinnerRoomUnit.queryAdcDinnerRoomUnitItemForManage", dto);
		for (int i = 0; i < items.size(); i++) {
			Dto dto2 = (BaseDto) items.get(i);
			if(G4Utils.isNotEmpty(dto2.getAsDate("valid_start_date"))){
				dto2.put("valid_start_date", G4Utils.Date2String(dto2.getAsDate("valid_start_date"), "yyyy-MM-dd"));
			}
			if(G4Utils.isNotEmpty(dto2.getAsDate("valid_end_date"))){
				dto2.put("valid_end_date", G4Utils.Date2String(dto2.getAsDate("valid_end_date"), "yyyy-MM-dd"));
			}
			dto2.put("operate_time", G4Utils.Date2String(dto2.getAsTimestamp("operate_time"), "yyyy-MM-dd HH:mm:ss"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcDinnerRoomUnit.queryAdcDinnerRoomUnitItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 保存一个就餐单元
	 */
	public ActionForward saveAdcDinnerRoomUnitItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		if (G4Utils.isEmpty(inDto.getAsString("group_id"))){
			inDto.remove("group_id");
		}
		if (G4Utils.isEmpty(inDto.getAsString("empid"))){
			inDto.remove("empid");
		}
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		inDto.put("operator", userInfoVo.getUserid());
		inDto.put("operate_time", G4Utils.getCurrentTimestamp());
		Dto outDto = adcDinnerRoomUnitService.saveAdcDinnerRoomUnitItem(inDto);
		if (outDto.getAsBoolean("success")){
			setOkTipMsg("就餐单位添加成功！", response);
		}else{
			this.setErrTipMsg(outDto.getAsString("message"), response);
		}
		return mapping.findForward(null);
	}	
	
	/**
	 * 删除一个就餐单元
	 */
	public ActionForward deleteAdcDinnerRoomUnitItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			adcDinnerRoomUnitService.deleteAdcDinnerRoomUnitItem(inDto);
		}
		setOkTipMsg("删除成功！", response);
		return mapping.findForward(null);
	}	
}
