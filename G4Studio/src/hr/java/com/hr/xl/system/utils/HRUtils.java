package com.hr.xl.system.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.g4studio.core.util.G4Utils;

public class HRUtils {

	public static String getFullDeptNameByDeptid(String deptid) {
		String fullName = null;
		for (int i = 2; i <= (deptid.length() / 3); i++) {
			String deptStr = deptid.substring(1, 3 * i);

		}
		return null;
	}

	public static String IntdateToStrDate(String intDate) {
		if (G4Utils.isEmpty(intDate)) {
			return null;
		}
		String maskStr = null;
		if (intDate.length() == 8) {
			maskStr = "yyyyMMdd";
		} else {
			maskStr = "yyyyMMddHHmmss";
		}
		Date date = G4Utils.stringToDate(intDate, maskStr, "yyyy-MM-dd");
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
		String resultStr = f.format(date);
		return resultStr;
	}

	public static String IntdatetimeToStrDateTime(String intDate) {
		if (G4Utils.isEmpty(intDate)) {
			return null;
		}
		Date date = G4Utils.stringToDate(intDate, "yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String resultStr = f.format(date);
		return resultStr;
	}

	public static String IntdatetimeToStrTime(String intDate) {
		if (G4Utils.isEmpty(intDate)) {
			return null;
		}
		String resultStr = null;
		Date date = G4Utils.stringToDate(intDate, "yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat f = new SimpleDateFormat("HH:mm:ss");
		resultStr = f.format(date);
		return resultStr;
	}

	public static float getIntervalHours(Date startDate, Date endDate) {
		long startdate = startDate.getTime();
		long enddate = endDate.getTime();
		long interval = enddate - startdate;
		float intervalHours = ((float) interval / (1000 * 60 * 60));
		return intervalHours;
	}

	public static String getWeekIntByDate(Date pDate) {
		final String dayNames[] = { "7", "1", "2", "3", "4", "5", "6" };
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(pDate);
		int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK) - 1;
		if (dayOfWeek < 0)
			dayOfWeek = 0;
		return dayNames[dayOfWeek];
	}
	
	public static int getIntervalDays(Date startDate, Date endDate) {
		long startdate = startDate.getTime();
		long enddate = endDate.getTime();
		long interval = enddate - startdate;
		int intervalday = (int) (interval / (1000 * 60 * 60 * 24));
		return intervalday;
	}
}
