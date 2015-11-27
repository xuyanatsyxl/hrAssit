package org.infotechdept.hr.kq.rpc.webservice.server;

import java.util.Date;
import java.util.List;

import javax.jws.WebService;

import org.g4studio.common.dao.Reader;
import org.g4studio.common.util.SpringBeanLoader;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;
import org.infotechdept.hr.kq.rpc.webservice.AdcShiftSchedulingService;

@WebService
public class AdcShiftSchedulingServiceImpl implements AdcShiftSchedulingService {
	
	private org.infotechdept.hr.kq.service.AdcShiftSchedulingService adcShiftSchedulingService = (org.infotechdept.hr.kq.service.AdcShiftSchedulingService) SpringBeanLoader.getSpringBean("adcShiftSchedulingService");
	private Reader g4Reader = (Reader) SpringBeanLoader.getSpringBean("g4Reader");
	/**
	 * 生成第二天的排班表
	 * @param pDate 日期格式：yyyyMMdd
	 */
	public String makeAdcShiftSchedulingDay(String pDate) {		
		Date date = G4Utils.stringToDate(pDate, "yyyyMMdd", "yyyy-MM-dd");
		Dto pDto = new BaseDto();
		List<Dto> items = g4Reader.queryForList("AdcShiftRecord.queryAdcShiftRecordItemForManage", pDto);
		for (Dto d : items){
			try{
				adcShiftSchedulingService.makeShiftSchedulingByDto(d, date);
			}catch(Exception e){
				
			}
		}
		return null;
	}

}
