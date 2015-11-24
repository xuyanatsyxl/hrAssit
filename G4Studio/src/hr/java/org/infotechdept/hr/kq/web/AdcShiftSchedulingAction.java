package org.infotechdept.hr.kq.web;

import java.util.Calendar;
import java.util.Date;
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
import org.infotechdept.hr.kq.service.AdcShiftSchedulingService;

public class AdcShiftSchedulingAction extends BaseAction {

	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	private AdcShiftSchedulingService adcShiftSchedulingService = (AdcShiftSchedulingService) super.getService("adcShiftSchedulingService");

	/**
	 * 根据下一个班次的信息
	 * 
	 * @param pattern_id
	 *            规律班次ID
	 * 
	 * @param lastId
	 *            最后一次的班次ID
	 * 
	 * @return Dto 包括应该的班次ID和shift_id
	 */
	private Dto getNextShiftValue(String pattern_id, int lastId) {
		Dto outDto = new BaseDto();
		Dto pDto = new BaseDto();
		pDto.put("pattern_id", pattern_id);
		List<Dto> detailDto = g4Reader.queryForList("AdcShiftPattern.queryAdcShiftPatternDetailItemForManage", pDto);
		for (int i = 0; i < detailDto.size(); i++) {
			if (detailDto.get(i).getAsInteger("position_id").intValue() == lastId) {
				int iPos;
				if (i == (detailDto.size() - 1)) {
					iPos = 0;
				} else {
					iPos = (i + 1);
				}
				outDto.put("shift_id", detailDto.get(iPos).getAsString("shift_id"));
				outDto.put("start_position", detailDto.get(iPos).getAsInteger("position_id"));
				break;
			}
		}
		return outDto;
	}

	/**
	 * 生成排班数据
	 */
	public ActionForward makeShiftScheduling(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);

		Date startDate = inDto.getAsDate("init_date");
		// 遍历，从开始时间至月底
		Calendar start = Calendar.getInstance();
		start.setTime(startDate);

		int lastId = inDto.getAsInteger("init_position").intValue();

		Calendar calc = Calendar.getInstance();

		boolean firstRun = true;

		String start_shift_id = inDto.getAsString("start_shift_id");

		while ((start.get(Calendar.DAY_OF_MONTH) != 1) || (firstRun)) {
			Dto pattDto = new BaseDto();
			if (firstRun) {
				pattDto.put("start_position", lastId);
				pattDto.put("shift_id", inDto.getAsString("start_shift_id"));
				firstRun = false;
			} else {
				pattDto = getNextShiftValue(inDto.getAsString("pattern_id"), lastId);
			}
			lastId = pattDto.getAsInteger("start_position").intValue();
			inDto.put("shift_id", pattDto.getAsString("shift_id"));
			inDto.put("start_position", pattDto.getAsInteger("start_position"));
			adcShiftSchedulingService.makeShiftSchedulingByDto(inDto, start.getTime());
			start.add(Calendar.DATE, 1);
			firstRun = false;
		}
		setOkTipMsg("排班数据更新成功！", response);
		return mapping.findForward(null);
	}

	/**
	 * 排班查询初始化
	 */
	public ActionForward adcShiftSchedulingInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
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
		return mapping.findForward("manageAdcShiftSchedulingView");
	}

	/**
	 * 查询排班
	 */
	public ActionForward queryAdcShiftSchedulingItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid) || (deptid.isEmpty())) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		List items = g4Reader.queryForPage("AdcShiftScheduling.queryAdcShiftSchedulingItemForManage", dto);
		for (int i = 0; i < items.size(); i++) {
			Dto dto2 = (BaseDto) items.get(i);
			String pDate = G4Utils.Date2String(dto2.getAsDate("sch_date"), "yyyy-MM-dd");
			dto2.put("work_time", G4Utils.Date2String(dto2.getAsTimestamp("work_time"), "HH:mm:ss"));
			dto2.put("off_time", G4Utils.Date2String(dto2.getAsTimestamp("off_time"), "HH:mm:ss"));
			dto2.put("actual_work_time", G4Utils.Date2String(dto2.getAsTimestamp("actual_work_time"), "HH:mm:ss"));
			dto2.put("actual_off_time", G4Utils.Date2String(dto2.getAsTimestamp("actual_off_time"), "HH:mm:ss"));
			dto2.put("sch_date", pDate);
			dto2.put("weeks", G4Utils.getWeekDayByDate(pDate));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftScheduling.queryAdcShiftSchedulingItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/**
	 * 修改排班数据
	 */
	public ActionForward updateAdcShiftSchedulingItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		List list = aForm.getGridDirtyData(request);
		String shiftId = request.getParameter("shift_id");
		Dto pDto = new BaseDto();
		pDto.put("shift_id", shiftId);
		pDto.setDefaultAList(list);
		adcShiftSchedulingService.updateAdcShiftSchedulingItem(pDto);
		setOkTipMsg("排班数据修改成功！", response);
		return mapping.findForward(null);
	}

	/**
	 * 考勤数据收集初始化
	 */
	public ActionForward getPointInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("getPointView");
	}

	/**
	 * 收集打卡数据
	 */
	public ActionForward getPoint(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			inDto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		inDto.put("cascadeid", organizationService.queryCascadeidByDeptid(inDto.getAsInteger("deptid")));
		inDto.remove("deptid");
		inDto.put("kssj", G4Utils.Date2String(inDto.getAsTimestamp("kssj"), "yyyyMMddHHmmss"));
		inDto.put("jssj", G4Utils.Date2String(inDto.getAsTimestamp("jssj"), "yyyyMMddHHmmss"));

		adcShiftSchedulingService.savePointDataAsync(inDto);
		setOkTipMsg("打卡数据收集工作已经提交后台，请过会儿后在报表中查看!", response);
		return mapping.findForward(null);
	}

	/**
	 * 根据起始结束日期生成排班表
	 */
	public ActionForward makeSchedulingByStartAndEndDate(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List list = aForm.getGridDirtyData(request);
		System.out.println(inDto.getAsString("musted"));
		inDto.setDefaultAList(list);
		adcShiftSchedulingService.makeSchedulingByStartAndEndDateAsync(inDto);
		return mapping.findForward(null);
	}

	public ActionForward updateAdcShiftSchedulingForWeekEnd(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		if (!isDemoMode(response)) {
			adcShiftSchedulingService.updateAdcShiftSchedulingForWeekEnd(inDto);
			setOkTipMsg("设置成功！", response);
		}
		return mapping.findForward(null);
	}
	
	public ActionForward queryAdcShiftBasicItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid) || deptid.isEmpty()) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		List items = g4Reader.queryForPage("AdcShiftBasic.queryAdcShiftBasicItemForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("AdcShiftBasic.queryAdcShiftBasicItemForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}
}
