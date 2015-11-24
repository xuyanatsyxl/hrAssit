package com.hr.xl.lxy.web;

import java.util.ArrayList;
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
import org.g4studio.core.web.report.jasper.ReportData;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;

public class LxyRptAction extends BaseAction {
	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");

	public ActionForward lxyxxInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("lxyxxView");
	}

	public ActionForward queryLxyxxForManager(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		if (G4Utils.isEmpty(dto.getAsString("deptid"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");

		super.setSessionAttribute(request, "QUERYLXYXX_QUERYDTO", dto);
		List lxyList = g4Reader.queryForPage("LXYReport.queryLxyxxForManager", dto);

		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);
			dto2.put("csrq", G4Utils.stringToDate(dto2.getAsString("csrq"), "yyyyMMdd", "yyyy-MM-dd"));

		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYReport.queryLxyxxForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryLxyXXForExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "联销员信息");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) super.getSessionAttribute(request, "QUERYLXYXX_QUERYDTO");
		inDto.put("rownum", "500");
		List fieldsList = g4Reader.queryForList("LXYReport.queryLxyxxForExcel", inDto);

		List paramList = g4Reader.queryForList("Param.queryParamsForManage");

		for (int i = 0; i < fieldsList.size(); i++) {
			Dto dto2 = (BaseDto) fieldsList.get(i);
			dto2.put("csrq", G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("csrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
			dto2.put("ydrq", G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));

		}
		/*
		 * int toIndex = 7; System.out.println(fieldsList.size() + "aa合计条数！！");
		 * if (fieldsList.size() <= toIndex) { toIndex = fieldsList.size(); }
		 */
		List subList = fieldsList.subList(0, fieldsList.size());
		System.out.println(subList.size() + "合计条数！！");
		parametersDto.put("countXmid", new Integer(subList.size()));// 合计条数
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/lxy/lxyxxquery.xls");
		excelExporter.setData(parametersDto, subList);
		excelExporter.setFilename("联销员信息.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	public ActionForward lxybmhzInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("lxybmhzView");
	}

	public ActionForward querylxybmhzForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List deptid = g4Reader.queryForList("LXYReport.querydeptid", dto);
		List fieldsList = new ArrayList<Dto>();
		for (int i = 0; i < deptid.size(); i++) {
			Dto deptidto = (Dto) deptid.get(i);
			Dto listDto = (Dto) g4Reader.queryForObject("LXYReport.querylxyxxhzForsum", deptidto);
			fieldsList.add(listDto);
		}
		super.setSessionAttribute(request, "QUERYBMLXYXXHZ", fieldsList);
		String jsonString = JsonHelper.encodeList2PageJson(fieldsList, 1, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward bmLxyhzForExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "联销员信息");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		List fieldsList = (List) super.getSessionAttribute(request, "QUERYBMLXYXXHZ");
		List subList = fieldsList.subList(0, fieldsList.size());
		System.out.println(subList.size() + "合计条数！！");
		parametersDto.put("countXmid", new Integer(subList.size()));// 合计条数
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/lxy/lxybmhz.xls");
		excelExporter.setData(parametersDto, subList);
		excelExporter.setFilename("部门联销员信息汇总.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	public ActionForward queryLxybmsqbJyForManager(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto dto = new BaseDto();
		// Dto dto = aForm.getParamAsDto(request);
		List lxyList = g4Reader.queryForPage("LXYBMSQB.queryLxybmsqbJyForManage", dto);

		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);
			dto2.put("ksrq", G4Utils.stringToDate(dto2.getAsString("ksrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("jsrq", G4Utils.stringToDate(dto2.getAsString("jsrq"), "yyyyMMdd", "yyyy-MM-dd"));

		}

		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBMSQB.queryLxybmsqbJyForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward bmlxyxxInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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

		return mapping.findForward("bmlxyxxView");
	}

	public ActionForward querybmLxyxxForManager(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		if (G4Utils.isEmpty(dto.getAsString("deptid"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		
		dto.put("dqzt", "2");
		super.setSessionAttribute(request, "QUERYBMLXYXX_QUERYDTO", dto);

		List lxyList = g4Reader.queryForPage("LXYReport.querybmLxyxxForManager", dto);
		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);
			dto2.put("csrq", G4Utils.stringToDate(dto2.getAsString("csrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("ydrq", G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("xjjsrq", G4Utils.stringToDate(dto2.getAsString("xjjsrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYReport.querybmLxyxxForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return null;
	}

	public ActionForward querybmLxyXXForExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "部门联销员信息");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) super.getSessionAttribute(request, "QUERYBMLXYXX_QUERYDTO");

		//过多的记录将禁止导出
		Integer temp = (Integer)g4Reader.queryForObject("LXYReport.querybmLxyxxForExcelForPageCount", inDto);
		if (temp.intValue() >= 8000){
			setErrTipMsg("系统禁止导出超过8000记录的EXCEL，请缩小查询范围后再试！", response);
			return mapping.findForward(null);
		}
		
		List fieldsList = g4Reader.queryForList("LXYReport.querybmLxyxxForExcel", inDto);
		for (int i = 0; i < fieldsList.size(); i++) {
			Dto dto2 = (BaseDto) fieldsList.get(i);
			dto2.put("csrq", G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("csrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
			dto2.put("ydrq", G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
			dto2.put("xjjsrq", G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("xjjsrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
		}
		List subList = fieldsList.subList(0, fieldsList.size());
		parametersDto.put("countXmid", new Integer(subList.size()));// 合计条数
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/lxy/bmlxyxxquery.xls");
		excelExporter.setData(parametersDto, subList);
		excelExporter.setFilename("部门联销员信息.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	public ActionForward lxyzzdymanager(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		String[] str = inDto.getAsString("strChecked").split(",");
		List list = new ArrayList<Dto>();
		for (int i = 0; i < str.length; i++) {
			Dto dto = new BaseDto();
			Dto outdto = new BaseDto();

			dto.put("ryid", str[i]);
			outdto = (BaseDto) g4Reader.queryForObject("LXYReport.querylxyzzdyManage", dto);

			list.add(outdto);

		}

		ReportData reportdata = new ReportData();
		reportdata.setFieldsList(list);

		reportdata.setReportFilePath("/report/jasper/hr/zhengzhang.jasper");
		getSessionContainer(request).setReportData("zhengzhang", reportdata);
		return mapping.findForward(null);
	}

}
