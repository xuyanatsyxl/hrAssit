package com.hr.xl.kq.web;

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
import org.g4studio.core.web.report.excel.ExcelExporter;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;

import com.hr.xl.kq.service.KqbcService;
import com.hr.xl.system.utils.HRUtils;

public class KqbcAction extends BaseAction {

	private KqbcService kqbcService = (KqbcService) super
			.getService("kqbcService");
	private OrganizationService organizationService = (OrganizationService) super
			.getService("organizationService");

	public ActionForward kcbcjlInit(ActionMapping mapping, ActionForm form,
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
		return mapping.findForward("manageKqbcjlView");
	}

	public ActionForward queryKqbcjlForManage(ActionMapping mapping,
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

		if (!G4Utils.isEmpty(dto.getAsTimestamp(("kssj")))) {
			dto.put("kssj",
					G4Utils.Date2String(dto.getAsTimestamp("kssj"), "yyyyMMdd")
							+ "000000");
		}

		if (!G4Utils.isEmpty(dto.getAsTimestamp("jssj"))) {
			dto.put("jssj",
					G4Utils.Date2String(dto.getAsTimestamp("jssj"), "yyyyMMdd")
							+ "000000");
		}

		super.setSessionAttribute(request, "QUERYKQBCJL_QUERYDTO", dto);

		List userList = g4Reader.queryForPage("KQBC_JL.queryKqbcjlForManage",
				dto);
		for (int i = 0; i < userList.size(); i++) {
			Dto dto2 = (BaseDto) userList.get(i);
			dto2.put("rq", HRUtils.IntdateToStrDate(dto2.getAsString("rq")));
			dto2.put("ydksj",
					HRUtils.IntdatetimeToStrTime(dto2.getAsString("ydksj")));
			dto2.put("sjdksj",
					HRUtils.IntdatetimeToStrTime(dto2.getAsString("sjdksj")));
			dto2.put("whsj",
					HRUtils.IntdatetimeToStrDateTime(dto2.getAsString("whsj")));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject(
				"KQBC_JL.queryKqbcjlForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(userList, pageCount,
				null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward updateKqbcjlItem(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		dto.put("whr", super.getSessionContainer(request).getUserInfo()
				.getUserid());
		dto.put("whsj", G4Utils.getCurrentTime("yyyyMMddHHmmss"));
		Dto outDto = kqbcService.updateKqbcjlItem(dto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryKqbcjlForExcel(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "打卡情况统计表");
		parametersDto.put("jbr", super.getSessionContainer(request)
				.getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) super.getSessionAttribute(request,
				"QUERYKQBCJL_QUERYDTO");
		inDto.put("rownum", "500");
		List fieldsList = g4Reader.queryForList("KQBC_JL.queryKqbcjlForManage",
				inDto);

		for (int i = 0; i < fieldsList.size(); i++) {
			Dto dto2 = (BaseDto) fieldsList.get(i);
			dto2.put("rq", HRUtils.IntdateToStrDate(dto2.getAsString("rq")));
			dto2.put("ydksj",
					HRUtils.IntdatetimeToStrTime(dto2.getAsString("ydksj")));
			dto2.put("sjdksj",
					HRUtils.IntdatetimeToStrTime(dto2.getAsString("sjdksj")));
			dto2.put("whsj",
					HRUtils.IntdatetimeToStrDateTime(dto2.getAsString("whsj")));
		}
		int toIndex = 500;
		/*
		 * if (fieldsList.size() <= toIndex) { toIndex = fieldsList.size() - 1;
		 * }
		 */
		List subList = fieldsList.subList(0, fieldsList.size());
		parametersDto.put("countXmid", new Integer(subList.size()));// 合计条数
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/kq/dkqktj.xls");
		excelExporter.setData(parametersDto, subList);
		excelExporter.setFilename("打卡情况统计表.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	public ActionForward jbjlInit(ActionMapping mapping, ActionForm form,
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
		return mapping.findForward("manageJbjlView");
	}

	public ActionForward queryJbjlForManage(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo()
					.getDeptid());
		}

		if (!G4Utils.isEmpty(dto.getAsTimestamp(("kssj")))) {
			dto.put("kssj",
					G4Utils.Date2String(dto.getAsTimestamp("kssj"), "yyyyMMdd")
							+ "000000");
		}

		if (!G4Utils.isEmpty(dto.getAsTimestamp("jssj"))) {
			dto.put("jssj",
					G4Utils.Date2String(dto.getAsTimestamp("jssj"), "yyyyMMdd")
							+ "000000");
		}

		super.setSessionAttribute(request, "QUERYJBJL_QUERYDTO", dto);

		List jbjlList = g4Reader
				.queryForPage("KQBC_JL.queryJbjlForManage", dto);
		for (int i = 0; i < jbjlList.size(); i++) {
			Dto dto2 = (BaseDto) jbjlList.get(i);
			Date rq = G4Utils.stringToDate(dto2.getAsString("rq"),
					"yyyyMMddHHmmss", "yyyy-MM-dd");
			dto2.put("rq", G4Utils.Date2String(rq, "yyyy-MM-dd"));
			dto2.put("week", G4Utils.getWeekDayByDate(G4Utils.Date2String(rq,
					"yyyy-MM-dd")));
			Date ydksj = G4Utils.stringToDate(dto2.getAsString("ydksj"),
					"yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss");
			dto2.put("ydksj", G4Utils.Date2String(ydksj, "yyyy-MM-dd HH:mm:ss"));
			Date sjdksj = G4Utils.stringToDate(dto2.getAsString("sjdksj"),
					"yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss");
			dto2.put("sjdksj",
					G4Utils.Date2String(sjdksj, "yyyy-MM-dd HH:mm:ss"));
			dto2.put("jbsj", HRUtils.getIntervalHours(ydksj, sjdksj));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject(
				"KQBC_JL.queryJbjlForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(jbjlList, pageCount,
				G4Constants.FORMAT_Time);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryJbjlForExcel(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "加班情况统计表");
		parametersDto.put("jbr", super.getSessionContainer(request)
				.getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) super.getSessionAttribute(request,
				"QUERYJBJL_QUERYDTO");
		List fieldsList = g4Reader.queryForList("KQBC_JL.queryJbjlForManage",
				inDto);

		for (int i = 0; i < fieldsList.size(); i++) {
			Dto dto2 = (BaseDto) fieldsList.get(i);
			Date rq = G4Utils.stringToDate(dto2.getAsString("rq"),
					"yyyyMMddHHmmss", "yyyy-MM-dd");
			dto2.put("rq", G4Utils.Date2String(rq, "yyyy-MM-dd"));
			dto2.put("week", G4Utils.getWeekDayByDate(G4Utils.Date2String(rq,
					"yyyy-MM-dd")));
			Date ydksj = G4Utils.stringToDate(dto2.getAsString("ydksj"),
					"yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss");
			dto2.put("ydksj", G4Utils.Date2String(ydksj, "HH:mm:ss"));
			Date sjdksj = G4Utils.stringToDate(dto2.getAsString("sjdksj"),
					"yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss");
			dto2.put("sjdksj", G4Utils.Date2String(sjdksj, "HH:mm:ss"));
			dto2.put("jbsj", HRUtils.getIntervalHours(ydksj, sjdksj));
		}
		List subList = fieldsList.subList(0, fieldsList.size());
		parametersDto.put("countXmid", new Integer(subList.size()));// 合计条数
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/kq/jbjl.xls");
		excelExporter.setData(parametersDto, subList);
		excelExporter.setFilename("加班统计表.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	public ActionForward queryWdkyy(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List items = g4Reader.queryForList("WDKYY.queryWdkyyItem", dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, null, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward kqbcjlSumReportInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
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
		return mapping.findForward("queryKqbcjlSumReportView");
	}

	public ActionForward queryKqbcjlSumReport(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo()
					.getDeptid());
		}

		if (!G4Utils.isEmpty(dto.getAsTimestamp(("kssj")))) {
			dto.put("kssj",
					G4Utils.Date2String(dto.getAsTimestamp("kssj"), "yyyyMMdd")
							+ "000000");
		}

		if (!G4Utils.isEmpty(dto.getAsTimestamp("jssj"))) {
			dto.put("jssj",
					G4Utils.Date2String(dto.getAsTimestamp("jssj"), "yyyyMMdd")
							+ "000000");
		}

		super.setSessionAttribute(request, "QUERYKQBCJLSUMREPORT_QUERYDTO", dto);
		List<Dto> rptList = g4Reader.queryForList(
				"KQBC_JL.queryKqbcJlSumReport", dto);
		String jsonString = JsonHelper.encodeList2PageJson(rptList, null, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
}
