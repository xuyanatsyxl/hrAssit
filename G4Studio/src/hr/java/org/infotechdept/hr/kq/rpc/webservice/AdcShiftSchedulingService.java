package org.infotechdept.hr.kq.rpc.webservice;

import javax.jws.WebService;

/**
 * 排班表的相关服务
 * @author xuyan
 *
 */
@WebService
public interface AdcShiftSchedulingService {

	/**
	 * 生成第二天的排班表
	 * @return
	 */
	public String makeAdcShiftSchedulingDay(String pDate);
}
