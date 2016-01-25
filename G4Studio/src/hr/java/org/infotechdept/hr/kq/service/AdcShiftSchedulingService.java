package org.infotechdept.hr.kq.service;

import java.text.ParseException;
import java.util.Date;

import org.g4studio.core.metatype.Dto;

public interface AdcShiftSchedulingService {

	public Dto saveAdcShiftSchedulingItem(Dto pDto);

	public Dto updateAdcShiftSchedulingItem(Dto pDto) throws ParseException;

	public Dto deleteAdcShiftSchedulingItem(Dto pDto);

	public Dto makeShiftSchedulingByDto(Dto recDto, Date pDate) throws ParseException;

	public Dto updateAdcShiftSchedulingItems(Dto pDto);

	public Dto savePointData(Dto pDto);

	public Dto makeSchedulingByStartAndEndDate(Dto pDto);

	public Dto updateAdcShiftSchedulingForWeekEnd(Dto pDto);

	public Dto makeSchedulingByStartAndEndDateAsync(Dto inDto);

	public Dto savePointDataAsync(Dto inDto);
	
	/**
	 * 考勤计画
	 */
	public Dto updateAdcShiftSchedulingFromPaint(Dto pDto);
	
	/**
	 * 给定时任务用的，生成当天的考勤记录
	 */
	public Dto makeSchedulingForTask();
	
}

