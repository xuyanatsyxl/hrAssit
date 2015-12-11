package com.hr.xl.lxy.web;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
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
import org.g4studio.core.mvc.xstruts.upload.FormFile;
import org.g4studio.core.util.G4Constants;
import org.g4studio.core.util.G4Utils;
import org.g4studio.core.web.report.excel.ExcelExporter;
import org.g4studio.core.web.report.excel.ExcelReader;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;

import com.hr.xl.lxy.service.BdjlService;
import com.hr.xl.lxy.service.LxyService;

public class LxyAction extends BaseAction {

	private LxyService lxyService = (LxyService) super.getService("lxyService");
	private BdjlService bdjlService = (BdjlService) super.getService("bdjlService");
	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");

	public ActionForward lxyInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("manageLxyView");
	}

	public ActionForward lxyzzdyInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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

		return mapping.findForward("manageLxyzzdyView");
	}

	public ActionForward lxypldrInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("lxypldr");
	}

	public ActionForward queryLxybmsqbForManager(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String userid = super.getSessionContainer(request).getUserInfo().getUserid();
		if (!G4Utils.isEmpty(dto.getAsString("ksrq"))) {
			dto.put("ksrq", G4Utils.Date2String(dto.getAsDate("ksrq"), "yyyyMMdd"));
		}

		if (!G4Utils.isEmpty(dto.getAsString("jsrq"))) {
			dto.put("jsrq", G4Utils.Date2String(dto.getAsDate("jsrq"), "yyyyMMdd"));
		}
		if (!G4Utils.isEmpty(dto.getAsString("jdr"))) {
			int jdr = Integer.parseInt(dto.getAsString("jdr").trim());

			if (jdr == 1) {
				System.out.println(jdr + "=jdr");
				dto.put("jdr", userid);
				dto.put("njdr", "");
			} else if (jdr == 2) {
				System.out.println(jdr + "=jdr");
				dto.put("jdr", "");
				dto.put("njdr", userid);
			}
		}

		super.setSessionAttribute(request, "QUERYLXYBMSQB_QUERYDTO", dto);
		List lxyList = g4Reader.queryForPage("LXYBMSQB.queryLxybmsqbForManage", dto);
		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);
			dto2.put("csrq", G4Utils.stringToDate(dto2.getAsString("csrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("jdrq", G4Utils.stringToDate(dto2.getAsString("jdrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}

		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBMSQB.queryLxybmsqbForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryLxybmsqbForExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "联销员报名申请表信息");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());

		Dto intodto = (BaseDto) super.getSessionAttribute(request, "QUERYLXYBMSQB_QUERYDTO");
		intodto.put("rownum", "500");
		List fieldsList = g4Reader.queryForList("LXYBMSQB.queryLxybmsqbForExcel", intodto);
		for (int i = 0; i < fieldsList.size(); i++) {
			Dto dto2 = (BaseDto) fieldsList.get(i);
			dto2.put("jdrq", G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("jdrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
			dto2.put("csrq", G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("csrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
		}

		List subList = fieldsList.subList(0, fieldsList.size());
		System.out.println(subList.size() + "合计条数！！");

		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/lxy/lxybmsqb.xls");
		excelExporter.setData(parametersDto, subList);
		excelExporter.setFilename("联销员报名申请表信息.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);

	}

	public ActionForward saveLxybmsqbItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		inDto.put("jdr", userInfoVo.getUserid());
		inDto.put("csrq", G4Utils.Date2String(inDto.getAsDate("csrq"), "yyyyMMdd"));
		inDto.put("jdrq", G4Utils.Date2String(G4Utils.getCurrentTimestamp(), "yyyyMMdd"));
		Dto outDto = lxyService.saveLxybmsqbItem(inDto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveLxybmsqbBatch(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		String filepath = writeBatchFile(aForm);

		Dto inDto = aForm.getParamAsDto(request);
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();

		inDto.put("jdr", userInfoVo.getUserid());
		inDto.put("jdrq", G4Utils.Date2String(G4Utils.getCurrentTimestamp(), "yyyyMMdd"));
		inDto.put("filepath", filepath);
		Dto outDto = lxyService.saveLxybmsqbBatch(inDto);
		System.out.println(outDto.get("success") + "===========" + outDto.get("msg"));
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * Excel批量导入
	 */
	public ActionForward importExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm actionForm = (BaseActionForm) form;
		Dto dto = actionForm.getParamAsDto(request);
		FormFile theFile = actionForm.getTheFile();
		String metaData = "xm,sfzh,pp,deptid,gw,ygxj,hyzk,mz,zzmm,hkxz,xzj,zgxl,byyx,xlzy,ydrq,jkzrq,lxsj,jjlxr,jjlxrsj";
		ExcelReader excelReader = new ExcelReader(metaData, theFile.getInputStream());
		List list = excelReader.read(3, 0);
		dto.setDefaultAList(list);
		dto.put("jdr", getSessionContainer(request).getUserInfo().getUserid());
		dto.put("jdrq", G4Utils.getCurrentTimeAsNumber());
		Dto outDto = lxyService.importFromExcel(dto);
		if (outDto.getAsBoolean("success")) {
			setOkTipMsg("导入成功!", response);
		} else {
			setErrTipMsg(outDto.getAsString("msg"), response);
		}
		return mapping.findForward(null);
	}

	public ActionForward updateLxybmsqbItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);

		inDto.put("csrq", G4Utils.Date2String(inDto.getAsDate("csrq"), "yyyyMMdd"));
		Dto outDto = lxyService.updateLxybmsqbItem(inDto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward deleteLxybmsqbItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			Dto outDto = lxyService.deleteLxybmsqbItem(inDto);
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		}
		return mapping.findForward(null);
	}

	public ActionForward queryLxybmsqbJyForManager(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
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

	public ActionForward saveLxybmsqbJyItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		// List list = aForm.getGridDirtyData(request);
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("ksrq", G4Utils.Date2String(inDto.getAsDate("ksrq"), "yyyyMMdd"));
		inDto.put("jsrq", G4Utils.Date2String(inDto.getAsDate("jsrq"), "yyyyMMdd"));
		// inDto.setDefaultAList(list);
		if (!isDemoMode(response)) {
			lxyService.saveLxybmsqbJyItem(inDto);
			setOkTipMsg("保存成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward queryLxybmsqbWbForManager(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List lxyList = g4Reader.queryForPage("LXYBMSQB.queryLxybmsqbWbForManage", dto);
		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);
			dto2.put("ksrq", G4Utils.stringToDate(dto2.getAsString("ksrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("jsrq", G4Utils.stringToDate(dto2.getAsString("jsrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBMSQB.queryLxybmsqbWbForManageForPageCount", dto);

		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);

	}

	public ActionForward queryLxybdjlInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
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
		return mapping.findForward("queryLxybdjlView");
	}

	public ActionForward queryLxybdjl(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
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
		if (!G4Utils.isEmpty(dto.getAsString("ksrq"))) {
			dto.put("ksrq", G4Utils.Date2String(dto.getAsDate("ksrq"), "yyyyMMddHHmmss"));
		}
		if (!G4Utils.isEmpty(dto.getAsString("jsrq"))) {
			dto.put("jsrq", addDay(dto.get("jsrq").toString(), 1));
			dto.put("jsrq", G4Utils.Date2String(dto.getAsDate("jsrq"), "yyyyMMddHHmmss"));
		}
		super.setSessionAttribute(request, "QUERYLXYBDJL_QUERYDTO", dto);
		List lxyList = g4Reader.queryForPage("LXYBDJL.queryLxybdjlForManage", dto);
		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);
			dto2.put("czsj", G4Utils.stringToDate(dto2.getAsString("czsj"), "yyyyMMddHHmmss", "yyyy-MM-dd HH-mm-ss"));
			dto2.put("jldate", G4Utils.stringToDate(dto2.getAsString("jldate"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("xhqxjrq", G4Utils.stringToDate(dto2.getAsString("xhqxjrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("yhqxjrq", G4Utils.stringToDate(dto2.getAsString("yhqxjrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("xjjsrq", G4Utils.stringToDate(dto2.getAsString("xjjsrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}

		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBDJL.queryLxybdjlForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryLxybdjlcx(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		if (!G4Utils.isEmpty(dto.getAsString("ksrq"))) {
			dto.put("ksrq", G4Utils.Date2String(dto.getAsDate("ksrq"), "yyyyMMddHHmmss"));
		}
		// System.out.println(dto.get("jsrq"));
		if (!G4Utils.isEmpty(dto.getAsString("jsrq"))) {
			dto.put("jsrq", addDay(dto.get("jsrq").toString(), 1));
			dto.put("jsrq", G4Utils.Date2String(dto.getAsDate("jsrq"), "yyyyMMddHHmmss"));

			System.out.println(dto.get("jsrq"));

		}

		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}
		List lxyList = g4Reader.queryForPage("LXYBDJL.queryLxybdjlForManage", dto);

		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);
			dto2.put("czsj", G4Utils.stringToDate(dto2.getAsString("czsj"), "yyyyMMddHHmmss", "yyyy-MM-dd HH-mm-ss"));
			dto2.put("jldate", G4Utils.stringToDate(dto2.getAsString("jldate"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("xhqxjrq", G4Utils.stringToDate(dto2.getAsString("xhqxjrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("yhqxjrq", G4Utils.stringToDate(dto2.getAsString("yhqxjrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("xjjsrq", G4Utils.stringToDate(dto2.getAsString("xjjsrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("jkzrq", G4Utils.stringToDate(dto2.getAsString("jkzrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBDJL.queryLxybdjlForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryLxybdjlForExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "联销员变动记录表");
		parametersDto.put("jbr", super.getSessionContainer(request).getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) super.getSessionAttribute(request, "QUERYLXYBDJL_QUERYDTO");
		inDto.put("rownum", "500");
		List fieldsList = g4Reader.queryForList("LXYBDJL.queryLxybdjlExcel", inDto);
		for (int i = 0; i < fieldsList.size(); i++) {
			Dto dto2 = (BaseDto) fieldsList.get(i);
			dto2.put("czsj", G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("czsj"), "yyyyMMddHHmmss", "yyyy-MM-dd HH-mm-ss"),
					"yyyy-MM-dd HH-mm-ss"));
			dto2.put("jldate",
					G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("jldate"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
			dto2.put("xhqxjrq",
					G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("xhqxjrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
			dto2.put("yhqxjrq",
					G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("yhqxjrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
			dto2.put("xjjsrq",
					G4Utils.Date2String(G4Utils.stringToDate(dto2.getAsString("xjjsrq"), "yyyyMMdd", "yyyy-MM-dd"), "yyyy-MM-dd"));
		}
		List subList = fieldsList.subList(0, fieldsList.size());
		parametersDto.put("countXmid", new Integer(subList.size()));// 合计条数
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/lxy/lxybdjl.xls");
		excelExporter.setData(parametersDto, subList);
		excelExporter.setFilename("联销员变动记录.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	/* 以下是联销员的业务操作 */
	/* 联销员入职 */
	public ActionForward lxySg(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);

		// 写入变动记录
		Dto bdDto = new BaseDto();
		bdDto.put("deptid", dto.getAsString("deptid"));
		bdDto.put("bdlx", "1");
		bdjlService.saveLxybdjlItem(bdDto);

		return mapping.findForward(null);
	}

	/* 联销员入职 */
	public ActionForward lxyHmd(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);

		// 写入变动记录
		Dto bdDto = new BaseDto();
		bdDto.put("deptid", dto.getAsString("deptid"));
		bdDto.put("bdlx", "1");
		bdjlService.saveLxybdjlItem(bdDto);

		return mapping.findForward(null);

	}

	public ActionForward saveLxybmsqbWbItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		// List list = aForm.getGridDirtyData(request);
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("ksrq", G4Utils.Date2String(inDto.getAsDate("ksrq"), "yyyyMMdd"));
		inDto.put("jsrq", G4Utils.Date2String(inDto.getAsDate("jsrq"), "yyyyMMdd"));

		if (!isDemoMode(response)) {
			lxyService.saveLxybmsqbWbItem(inDto);
			setOkTipMsg("保存成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward deleteLxybmsqbJyItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			lxyService.deleteLxybmsqbJyItem(inDto);
			setOkTipMsg("删除成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward deleteLxybmsqbWbItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			lxyService.deleteLxybmsqbWbItem(inDto);
			setOkTipMsg("删除成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward queryLxyxj(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		// super.removeSessionAttribute(request, "deptid");
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		
		if (!G4Utils.isEmpty(dto.getAsString("xjjsrqstart"))) {
			dto.put("xjjsrqstart", G4Utils.Date2String(dto.getAsDate("xjjsrqstart"), "yyyyMMdd"));

		}
		if (!G4Utils.isEmpty(dto.getAsString("xjjsrqend"))) {
			dto.put("xjjsrqend", G4Utils.Date2String(dto.getAsDate("xjjsrqend"), "yyyyMMdd"));

		}
		List lxyList = g4Reader.queryForPage("BMLXY.queryLxyxjForManage", dto);
		/*
		 * b.DEPTID, (SELECT DEPTNAME from eadept where DEPTID=b.DEPTID) as
		 * deptname, a.RYID, a.RYBH, a.XM, a.XB, b.YGXJ, b.GHDW, b.PP, b.YDRQ,
		 * a.SFZH,b.HQXJRQ,B.XJJSRQ,b.GW
		 */
		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);

			dto2.put("ydrq", G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("hqxjrq", G4Utils.stringToDate(dto2.getAsString("hqxjrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("yhqxjrq", G4Utils.stringToDate(dto2.getAsString("xjjsrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("xjjsrq", G4Utils.stringToDate(dto2.getAsString("xjjsrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}

		Integer pageCount = (Integer) g4Reader.queryForObject("BMLXY.queryLxyxjForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/**
	 * 更新星级
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward updatelxyxj(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List list = aForm.getGridDirtyData(request);
		dto.setDefaultAList(list);
		dto.put("czy", super.getSessionContainer(request).getUserInfo().getUserid());
		dto.put("czsj", G4Utils.getCurrentTimeAsNumber());
		dto.put("bdrq", G4Utils.getCurrentTimeAsNumber());
		if (G4Utils.isEmpty(dto.getAsInteger("xjnx"))) {

		} else {
			int xjnx = dto.getAsInteger("xjnx");
			dto.put("xjjsrq", addYear(dto.getAsString("hqxjrq"), xjnx));
		}
		if (!isDemoMode(response)) {
			lxyService.updateLxyxj(dto);
			setOkTipMsg("修改成功", response);
		}
		return mapping.findForward(null);
	}

	public String writeBatchFile(BaseActionForm cForm) throws Exception {
		// 单个文件,如果是多个就cForm.getFile2()....支持最多5个文件
		FormFile myFile = cForm.getFile2();
		// 获取web应用根路径,也可以直接指定服务器任意盘符路径
		String savePath = getServlet().getServletContext().getRealPath("/") + "/upload/";
		// String savePath = "d:/upload/";
		// 检查路径是否存在,如果不存在则创建之
		File file = new File(savePath);
		if (!file.exists()) {
			file.mkdir();
		}
		// 文件按天归档
		// savePath = savePath + G4Utils.getCurDate() + "/";
		File file1 = new File(savePath);
		if (!file1.exists()) {
			file1.mkdir();
		}
		// 文件真实文件名
		String fileName = myFile.getFileName();
		// 我们一般会根据某种命名规则对其进行重命名
		// String fileName = ;
		File fileToCreate = new File(savePath, fileName);
		// 检查同名文件是否存在,不存在则将文件流写入文件磁盘系统
		if (!fileToCreate.exists()) {
			FileOutputStream os = new FileOutputStream(fileToCreate);
			os.write(myFile.getFileData());
			os.flush();
			os.close();
		} else {
			// 此路径下已存在同名文件,是否要覆盖或给客户端提示信息由你自己决定
			FileOutputStream os = new FileOutputStream(fileToCreate);
			os.write(myFile.getFileData());
			os.flush();
			os.close();
		}

		return savePath + fileName;
	}

	public ActionForward queryLxybmsqbJJForManager(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List lxyList = g4Reader.queryForPage("LXYBMSQB.queryLxybmsqbJJForManage", dto);
		for (int i = 0; i < lxyList.size(); i++) {
			Dto dto2 = (BaseDto) lxyList.get(i);

			dto2.put("jjcsrq", G4Utils.stringToDate(dto2.getAsString("jjcsrq"), "yyyyMMdd", "yyyy-MM-dd"));

		}

		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBMSQB.queryLxybmsqbJJForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveLxybmsqbJJItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		// List list = aForm.getGridDirtyData(request);
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("jjcsrq", G4Utils.Date2String(inDto.getAsTimestamp("jjcsrq"), "yyyyMMdd"));
		// inDto.put("jsrq", inDto.getAsTimestamp("jsrq"));
		// inDto.setDefaultAList(list);
		if (!isDemoMode(response)) {
			lxyService.saveLxybmsqbJJItem(inDto);
			setOkTipMsg("保存成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward deleteLxybmsqbJJItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			lxyService.deleteLxybmsqbJJItem(inDto);
			setOkTipMsg("删除成功", response);
		}
		return mapping.findForward(null);
	}

	public String addDay(String s, int n) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar ca = Calendar.getInstance();
			ca.setTime(sdf.parse(s));
			ca.add(Calendar.DATE, n);

			return sdf.format(ca.getTime());
		} catch (Exception e) {
			return s;
		}
	}

	public String addYear(String s, int n) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar ca = Calendar.getInstance();
			ca.setTime(sdf.parse(s));
			ca.add(Calendar.YEAR, n);

			return sdf.format(ca.getTime());
		} catch (Exception e) {
			return s;
		}
	}

}
