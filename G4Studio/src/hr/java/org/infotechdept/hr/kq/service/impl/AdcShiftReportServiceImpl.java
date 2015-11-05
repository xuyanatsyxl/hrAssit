package org.infotechdept.hr.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.infotechdept.hr.kq.service.AdcShiftReportService;

public class AdcShiftReportServiceImpl extends BaseServiceImpl implements AdcShiftReportService {

	public Dto makeAdcShiftReport(Dto pDto) {
		Dto outDto = new BaseDto();
		// 先检查是否有未处理的异常记录
		Integer temp = (Integer) g4Dao.queryForObject("AdcReportPersonMonth.checkUnProcExceptionExists", pDto);
		if (temp.intValue() > 0) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "时间段内有未处理的异常记录，不能生成报表！");
			return outDto;
		}
		// 调用存储过程生成报表
		Dto paramDto = new BaseDto();
		paramDto.put("p_deptid", pDto.getAsString("deptid"));
		paramDto.put("p_yearmonth", pDto.getAsString("yearmonth"));
		g4Dao.getSqlMapClientTpl().update("AdcReportPersonMonth.f_make_report", paramDto);

		String resultCode = paramDto.getAsString("appCode");
		if (resultCode.equalsIgnoreCase("1")) {
			outDto.put("success", new Boolean(true));
			outDto.put("msg", "考勤报表生成成功！请在相关的菜单中查看");
		} else {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "考勤报表生成失败，返回错误:" + paramDto.getAsString("errMsg"));
		}
		return outDto;
	}

}
