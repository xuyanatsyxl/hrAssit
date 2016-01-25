package org.infotechdept.hr.kq.service.impl;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.orm.xibatis.sqlmap.client.SqlMapExecutor;
import org.g4studio.core.orm.xibatis.support.SqlMapClientCallback;
import org.g4studio.core.util.G4Utils;
import org.g4studio.system.admin.service.OrganizationService;
import org.infotechdept.hr.kq.service.AdcShiftSchedulingService;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.core.task.SimpleAsyncTaskExecutor;

import com.hr.xl.system.utils.HRUtils;

public class AdcShiftSchedulingServiceImpl extends BaseServiceImpl implements AdcShiftSchedulingService {
	
	
	private OrganizationService organizationService;

	public OrganizationService getOrganizationService() {
		return organizationService;
	}

	public void setOrganizationService(OrganizationService organizationService) {
		this.organizationService = organizationService;
	}

	private Dto getActualTime(Dto pDto) {
		Dto outDto = new BaseDto();
		Dto dto1 = (Dto) g4Dao.queryForObject("AdcShift.queryAdcShiftDetailItemForManage", pDto);

		return outDto;
	}

	@Override
	public Dto saveAdcShiftSchedulingItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 根据条件返回请假记录
	 * (只返回对考勤标记有影响的记录)
	 * @param empid
	 * @param deptid
	 * @param pDate
	 * @return
	 */
	private Dto getAdcShiftLeaveByInfo(Integer empid, String deptid, Date pDate){
		Dto inDto = new BaseDto();
		inDto.put("empid", empid);
		inDto.put("deptid", deptid);			
		inDto.put("adc_date", G4Utils.Date2String(pDate, "yyyy-MM-dd"));
		List<Dto> items = g4Dao.queryForList("AdcShiftLeave.queryAdcShiftLeaveItemForManage", inDto);
		if (items.size() == 0){
			return null;
		}else{
			if (items.get(0).getAsString("adc_type").equalsIgnoreCase("1")){
				return items.get(0);
			}else{
				return null;
			}
		}
	}
	
	/**
	 * 更新排班数据
	 * 
	 * @throws ParseException
	 */
	public Dto updateAdcShiftSchedulingItem(Dto pDto) throws ParseException {
		List<Dto> list = pDto.getDefaultAList();
		String shiftId = pDto.getAsString("shift_id");
		List ids = new ArrayList<String>();
		List empList = new ArrayList<String>();
		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);
			ids.add(dto.getAsString("id"));
			empList.add(dto.getAsString("empid"));
			Date pDate = dto.getAsDate("sch_date");
			Dto shiftDto = getWorkAndOffTimeByShiftId(shiftId, pDate, new Boolean(false));

			dto.put("work_time", shiftDto.getAsTimestamp("dateWork"));
			dto.put("off_time", shiftDto.getAsTimestamp("dateOff"));
			dto.put("shift_id", shiftId);
			dto.put("adc_id", shiftDto.getAsString("adc_id"));
			dto.remove("actual_work_time");
			dto.remove("actual_off_time");
			g4Dao.update("AdcShiftScheduling.updateAdcShiftSchedulingItem", dto);
		}

		// 更新打卡记录
		Dto dateDto = (Dto) g4Dao.queryForObject("AdcShiftScheduling.queryMaxAndMinDate", ids);
		pDto.clear();
		pDto.put("start_date", dateDto.getAsDate("start_date"));
		pDto.put("end_date", dateDto.getAsDate("end_date"));
		pDto.put("emps", empList);
		savePointData(pDto);
		return null;
	}

	@Override
	public Dto deleteAdcShiftSchedulingItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 查找重复的排班记录，并根据优先级决定是UPDATE还是略过
	 * 
	 * @param pDto
	 * @return
	 */
	private int updateOrInsert(Dto pDto) {
		return 0;
	}

	/**
	 * 根据初始化的排班记录，计算参数日期当天该上什么班
	 * @param adcShiftRecordDto 班次初始化记录
	 * @param pDate
	 * @return
	 */
	private Dto getShiftIdByPatternIdAndDate(Dto adcShiftRecordDto, Date pDate) {
		Dto pDto = new BaseDto();
		//首先查看该记录是否允许节休，允许的话要看当天是否在节休的串休日内，是的话
		//就不能计算指定日期，要计算串换掉的日期
		if (adcShiftRecordDto.getAsString("holiable").equalsIgnoreCase("1")) {
			Dto paramDto = new BaseDto();
			paramDto.put("string_date", G4Utils.Date2String(pDate, "yyyy-MM-dd"));
			Dto dto = (Dto) g4Dao.queryForObject("AdcHoliday.queryAdcHolidayDetailItemForManage", paramDto);
			if (G4Utils.isNotEmpty(dto)) {
				pDate = dto.getAsDate("h_date");
			}
		}
		pDto.put("pattern_id", adcShiftRecordDto.getAsString("patternId"));
		List detailList = g4Dao.queryForList("AdcShiftPattern.queryAdcShiftPatternDetailItemForManage", adcShiftRecordDto);
		int interval = (int) (HRUtils.getIntervalDays(adcShiftRecordDto.getAsDate("init_date"), pDate));
		int tmp = interval % detailList.size();
		int iPosition = adcShiftRecordDto.getAsInteger("init_position").intValue() + tmp;
		if (iPosition > detailList.size()) {
			iPosition = iPosition - detailList.size();
		}

		Dto detailDto = (Dto) detailList.get(iPosition - 1);
		return detailDto;
	}

	/**
	 * 生成包含指定日期的上下班打卡时间的Dto
	 * 
	 * @param shiftId
	 *            基本班次编码
	 * @param pDate
	 *            日期
	 * @return
	 * @throws ParseException
	 */
	private Dto getWorkAndOffTimeByShiftId(String shiftId, Date pDate, Boolean holiable) throws ParseException {
		Dto outDto = new BaseDto();
		// 先检查当天是否是节休，节休最大
		
		if (holiable) {
			Dto paramDto = new BaseDto();
			paramDto.put("date", G4Utils.Date2String(pDate, "yyyy-MM-dd"));
			Dto dto = (Dto) g4Dao.queryForObject("AdcHoliday.queryAdcHolidayDetailItemForManage", paramDto);
			if (G4Utils.isNotEmpty(dto)) {
				outDto.put("dateWork", null);
				outDto.put("dateOff", null);
				outDto.put("adc_id", dto.getAsString("adc_id"));
				outDto.put("shift_id", null);
				outDto.put("symbol", dto.getAsString("symbol"));
				return outDto;
			}
		}

		if (G4Utils.isEmpty(shiftId) || (shiftId.equalsIgnoreCase("null"))) {
			outDto.put("dateWork", null);
			outDto.put("dateOff", null);
			outDto.put("adc_id", "0201");
			outDto.put("shift_id", null);
			outDto.put("symbol", "休");
		} else {
			Dto pDto = new BaseDto();
			pDto.put("shift_id", shiftId);
			Dto shiftDto = (Dto) g4Dao.queryForObject("AdcShiftBasic.queryAdcShiftBasicItemForManage", pDto);

			String work_time = G4Utils.Date2String(pDate, "yyyy-MM-dd") + " " + shiftDto.getAsString("work_time") + ":00";
			String off_time = G4Utils.Date2String(pDate, "yyyy-MM-dd") + " " + shiftDto.getAsString("off_time") + ":00";

			Timestamp dateWork = new Timestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(work_time).getTime());
			Timestamp dateOff = new Timestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(off_time).getTime());
			// 如果类型为隔日下班，则要写下一天
			if (shiftDto.getAsInteger("shift_type").intValue() == 2) {
				Calendar c = Calendar.getInstance();
				c.setTime(dateOff);
				c.add(Calendar.DAY_OF_MONTH, 1);
				dateOff = new Timestamp(c.getTimeInMillis());
			}
			outDto.put("shift_type", shiftDto.getAsInteger("shift_type"));
			outDto.put("dateWork", dateWork);
			outDto.put("dateOff", dateOff);
			outDto.put("adc_id", shiftDto.getAsString("adc_id"));
			outDto.put("shift_id", shiftId);
			outDto.put("symbol", shiftDto.getAsString("symbol"));
		}
		return outDto;
	}

	/**
	 * 生成指定日期班次(JDBC批处理)
	 * 
	 * @param recDto
	 *            AdcShiftRecord表里的一行记录，包括字段 rec_id, deptid, group_id, empid,
	 *            start_date, record_type start_position, pattern_id
	 * @param pDate
	 *            生成的日期
	 * @return
	 * @throws ParseException
	 * @throws SQLException
	 */
	public Dto makeShiftSchedulingByDto(final Dto recDto, final Date pDate) throws ParseException {
		Dto pDto = new BaseDto();
		boolean holiable = recDto.getAsString("holiable").equalsIgnoreCase("1");
		String ibatis = null;
		final Dto adcShiftDetailDto = getShiftIdByPatternIdAndDate(recDto, pDate);

		// 根据shift_id获得上下班打卡时间

		final Dto dateDto = getWorkAndOffTimeByShiftId(adcShiftDetailDto.getAsString("shift_id"), pDate, holiable);
		String record_type = recDto.getAsString("record_type");
		String cascadeid = organizationService.queryCascadeidByDeptid(recDto.getAsInteger("deptid"));
		recDto.put("cascadeid", cascadeid);
		if (record_type.equalsIgnoreCase("1")) {
			recDto.remove("empid");
			recDto.remove("group_id");
			ibatis = "AdcShiftScheduling.queryDeptemplsForSchedulingByDeptid";
		} else if (record_type.equalsIgnoreCase("2")) {
			recDto.remove("empid");
			ibatis = "AdcShiftScheduling.queryDeptemplsForSchedulingByGroupId";
		} else if (record_type.equalsIgnoreCase("3")) {
			recDto.remove("group_id");
			ibatis = "AdcShiftScheduling.queryDeptemplsForSchedulingByEmpid";
		}

		final List<Dto> empList = g4Dao.queryForList(ibatis, recDto);

		// 采用ibatis JDBC批处理的方式进行写操作
		g4Dao.getSqlMapClientTpl().execute(new SqlMapClientCallback() {
			public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
				executor.startBatch();
				for (Dto empDto : empList) {
					empDto.put("sch_date", pDate);
					empDto.put("record_type", recDto.getAsString("record_type"));
					// 查找重复记录
					Dto schDto = (Dto) g4Dao.queryForObject("AdcShiftScheduling.checkAdcShiftSchedulingExists", empDto);
					// 比较二者的优先级，决定是更新还是跳过，别更新了，删除吧，比较快还简单
					if (G4Utils.isNotEmpty(schDto)) {
						int extPri = schDto.getAsInteger("priority").intValue();
						if (extPri > 0) {
							if (recDto.getAsInteger("priority").intValue() < extPri) {
								continue;
							} else {
								empDto.put("id", schDto.getAsInteger("id"));
								executor.delete("AdcShiftScheduling.deleteAdcShiftSchedulingItem", empDto);
							}
						}
					}
					
					//查找是否有请假的记录
					Dto d = getAdcShiftLeaveByInfo(empDto.getAsInteger("empid"), empDto.getAsString("deptid"), pDate);
					if (G4Utils.isNotEmpty(d)){
						empDto.put("adc_id", d.getAsString("adc_id"));
						empDto.put("rec_id", recDto.getAsBigDecimal("rec_id"));
						empDto.put("count", d.getAsBigDecimal("aff_days"));
						empDto.put("priority", recDto.getAsString("priority"));
						if (d.getAsBigDecimal("aff_days").doubleValue() == 0.5){
							empDto.put("shift_id", dateDto.getAsString("shift_id"));
							empDto.put("work_time", dateDto.getAsTimestamp("dateWork"));
							empDto.put("shift_symbol", "/" + d.getAsString("symbol"));
						}else if (d.getAsBigDecimal("aff_days").doubleValue() == -0.5){
							empDto.put("shift_id", dateDto.getAsString("shift_id"));
							empDto.put("off_time", dateDto.getAsTimestamp("dateOff"));
							empDto.put("shift_symbol", d.getAsString("symbol") + "/" );
						}else if (d.getAsBigDecimal("aff_days").doubleValue() == 1){
							empDto.put("shift_symbol", d.getAsString("symbol"));
						}
					}else{					
						empDto.put("pattern_detail_id", recDto.getAsInteger("pattern_detail_id"));
						empDto.put("priority", recDto.getAsString("priority"));
						empDto.put("rec_id", recDto.getAsBigDecimal("rec_id"));
						empDto.put("shift_id", dateDto.getAsString("shift_id"));
						empDto.put("work_time", dateDto.getAsTimestamp("dateWork"));
						empDto.put("off_time", dateDto.getAsTimestamp("dateOff"));
						empDto.put("adc_id", dateDto.getAsString("adc_id"));
						empDto.put("shift_symbol", dateDto.getAsString("symbol"));
						empDto.put("count", 1);
					}
					executor.insert("AdcShiftScheduling.saveAdcShiftSchedulingItem", empDto);
				}
				executor.executeBatch();
				return null;
			}
		});
		return null;
	}

	/**
	 * 批量修改班次
	 */
	public Dto updateAdcShiftSchedulingItems(Dto pDto) {
		Dto dto = new BaseDto();
		dto.put("shift_id", pDto.getAsString("shift_id"));
		Dto shiftDto = (Dto) g4Dao.queryForObject("AdcShiftBasic.queryAdcShiftBasicItemForManage", dto);
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("id", arrChecked[i]);
			dto.put("work_time", shiftDto.getAsTimestamp("work_time"));
			dto.put("off_time", shiftDto.getAsTimestamp("off_time"));
			dto.put("adc_id", shiftDto.getAsString("adc_id"));
			g4Dao.update("adcShiftScheduling.updateAdcShiftSchedulingItem", dto);
		}
		return null;
	}

	private String getJobnameByEmpid(int empid) {
		Dto dto = new BaseDto();
		dto.put("empid", empid);
		Dto resultDto = (Dto) g4Dao.queryForObject("Deptempl.queryDeptemplItemForManage", dto);
		if (G4Utils.isEmpty(resultDto)) {
			return null;
		} else {
			return resultDto.getAsString("jobname");
		}
	}

	/**
	 * 批量导入打卡数据
	 */
	public Dto savePointData(Dto pDto) {
		// 调用存储过程处理记录
		Dto paramDto = new BaseDto();
		List emplList = g4Dao.queryForList("DKJL.queryDkjlForManage", pDto);
		for (int i = 0; i < emplList.size(); i++) {
			Dto dto2 = (BaseDto) emplList.get(i);
			paramDto.put("empid", dto2.getAsString("empid"));
			Date dksjDate = G4Utils.stringToDate(dto2.getAsString("dksj"), "yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss");
			paramDto.put("dksj", dksjDate);
			g4Dao.callPrc("AdcShiftScheduling.f_proc_dkjl", paramDto);
		}
		return null;
	}
	

	
	/**
	 * 批量导入打卡数据（异步方法）
	 */
	public Dto savePointDataAsync(Dto pDto) {
		// 调用存储过程处理记录
		AsyncTaskExecutor excutor = new SimpleAsyncTaskExecutor("sys.out");
		excutor.execute(new SavePoint(pDto));
		return null;
	}

	class SavePoint implements Runnable{
		private Dto pDto = new BaseDto();
		public SavePoint(Dto dto){
			pDto = dto;
		}

		public void run() {
			Dto paramDto = new BaseDto();
			Date tmpDate = pDto.getAsDate("start_date");
			Date endDate = pDto.getAsDate("end_date");
			
			paramDto.put("prm_cascadeid", pDto.getAsString("cascadeid"));
			while (tmpDate.getTime() <= endDate.getTime()) {
				String dateStr = G4Utils.Date2String(tmpDate, "yyyyMMdd") + "000000";
				paramDto.put("p_rq", dateStr);
				g4Dao.callPrc("AdcShiftScheduling.hr_make_kq_report", paramDto);
				
				Calendar calendar = Calendar.getInstance();
				calendar.setTime(tmpDate);
				calendar.add(Calendar.DAY_OF_MONTH, 1);
				tmpDate = calendar.getTime();
			}
		}
		
	}
	
	/**
	 * 根据起始结束日期生成排班表
	 */
	public Dto makeSchedulingByStartAndEndDate(Dto pDto) {
		Date startDate = pDto.getAsDate("start_date");
		Date endDate = pDto.getAsDate("end_date");
		List<Dto> recList = pDto.getDefaultAList();

		Calendar tmpCalendar = Calendar.getInstance();
		tmpCalendar.setTime(startDate);

		while (tmpCalendar.getTime().getTime() <= endDate.getTime()) {
			for (Dto dto : recList) {
				try {
					makeShiftSchedulingByDto(dto, tmpCalendar.getTime());
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			tmpCalendar.add(Calendar.DAY_OF_MONTH, 1);
		}

		return null;
	}

	/**
	 * 根据起始结束日期生成排班表
	 * 和上面不同的地方这个是异步方法
	 * 同等优先级的排班，在未发生成日期里，后面的会覆盖前面的。
	 */
	public Dto makeSchedulingByStartAndEndDateAsync(Dto pDto) {
		AsyncTaskExecutor excutor = new SimpleAsyncTaskExecutor("sys.out");
		excutor.execute(new OutThread(pDto));
		return null;
	}
		
		class OutThread implements Runnable{
			private Dto pDto = new BaseDto();
			public OutThread(Dto dto){
				pDto = dto;	
			}
			public void run() {
				Date startDate = pDto.getAsDate("start_date");
				Boolean fullGen = pDto.getAsString("musted").equalsIgnoreCase("on");
				/**
				 * 比较当前日期和生成条件的日期，谁大用谁当条件
				 */
				if (!fullGen){
					Long cur = Long.valueOf(G4Utils.getCurDate("yyyyMMdd"));
					Long start = Long.valueOf(G4Utils.Date2String(startDate, "yyyyMMdd"));
					if (start.longValue() < cur.longValue()){
						startDate = G4Utils.stringToDate(G4Utils.getCurDate("yyyy-MM-dd"), "yyyy-MM-dd", "yyyy-MM-dd");
					}
				}
				Date endDate = pDto.getAsDate("end_date");
				List<Dto> recList = pDto.getDefaultAList();

				Calendar tmpCalendar = Calendar.getInstance();
				tmpCalendar.setTime(startDate);

				while (tmpCalendar.getTime().getTime() <= endDate.getTime()) {
					for (Dto dto : recList) {
						Dto logDto = new BaseDto();
						logDto.put("rq", tmpCalendar.getTime());
						logDto.put("rec_id", dto.getAsBigDecimal("rec_id"));
						logDto.put("begin_time", G4Utils.getCurrentTime());
						try {
							if (fullGen){
								dto.put("tmpdate", G4Utils.Date2String(tmpCalendar.getTime(), "yyyy-MM-dd"));
								g4Dao.delete("AdcShiftScheduling.deleteAdcShiftSchedulingItem", dto);
							}
							makeShiftSchedulingByDto(dto, tmpCalendar.getTime());
							logDto.put("state", "2");
						} catch (ParseException e) {
							logDto.put("state", "1");
							logDto.put("memo", e.getMessage());
							e.printStackTrace();
						}finally{
							logDto.put("end_time", G4Utils.getCurrentTime());
							g4Dao.insert("AdcShiftRecord.saveAdcShiftRecordLogsItem", logDto);
						}
					}
					tmpCalendar.add(Calendar.DAY_OF_MONTH, 1);
				}
			}
	}
	
	public Dto updateAdcShiftSchedulingForWeekEnd(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		String adc_id = pDto.getAsString("adc_id");
		List<String> ids = new ArrayList<String>();
		for (int i = 0; i < arrChecked.length; i++) {
			ids.add(arrChecked[i]);
		}
		dto.clear();
		dto.put("ids", ids);
		dto.put("adc_id", adc_id);
		g4Dao.update("AdcShiftScheduling.updateAdcShiftSchedulingForWeekEnd", dto);
		return null;
	}

	/**
	 * 考勤计画
	 */
	public Dto updateAdcShiftSchedulingFromPaint(Dto pDto) {
		String strChecked = pDto.getAsString("strChecked");
		String[] idStr = strChecked.split(",");
		for (String id : idStr){
			pDto.put("id", id);
			g4Dao.update("AdcShiftScheduling.updateAdcShiftSchedulingItem", pDto);			
		}
		return null;
	}

	/**
	 * 定时任务代码还是回到了主代码中，没办法....
	 * 定时调度定义在了global.task.xml
	 */
	public Dto makeSchedulingForTask() {
		List<Dto> recDto = g4Dao.queryForList("AdcShiftRecord.queryAdcShiftRecordItemForManage");
		Dto pDto = new BaseDto();
		pDto.put("start_date", G4Utils.getCurDate("yyyy-MM-dd"));
		pDto.put("end_date", G4Utils.getCurDate("yyyy-MM-dd"));
		pDto.put("musted", "on");
		pDto.setDefaultAList(recDto);
		
		makeSchedulingByStartAndEndDateAsync(pDto);
		return null;
	}
}
