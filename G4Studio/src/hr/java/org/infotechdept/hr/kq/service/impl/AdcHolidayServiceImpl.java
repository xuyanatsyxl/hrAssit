package org.infotechdept.hr.kq.service.impl;

import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;
import org.infotechdept.hr.kq.service.AdcHolidayService;

import com.hr.xl.system.utils.IDHelper;

public class AdcHolidayServiceImpl extends BaseServiceImpl implements AdcHolidayService {

	/**
	 * 保存节日信息
	 */
	public Dto saveAdcHolidayItem(Dto pDto) {
		List<Dto> aList = pDto.getDefaultAList();
		String code = IDHelper.gethCode();
		pDto.put("h_code", code);
		g4Dao.insert("AdcHoliday.saveAdcHolidayItem", pDto);
		for (Dto dto : aList) {
			dto.put("h_code", code);
			g4Dao.insert("AdcHoliday.saveAdcHolidayDetailItem", dto);
		}
		return null;
	}

	public Dto updateAdcHolidayItem(Dto pDto) {
		List<Dto> aList = pDto.getDefaultAList();
		g4Dao.update("AdcHoliday.updateAdcHolidayItem", pDto);
		g4Dao.delete("AdcHoliday.deleteAdcHolidayDetailItemByCode", pDto);
		for (Dto dto : aList) {
			if (G4Utils.isEmpty(dto.getAsDate("string_date"))) {
				dto.remove("string_date");
			}
			g4Dao.insert("AdcHoliday.saveAdcHolidayDetailItem", dto);
		}
		return null;
	}

	public Dto deleteAdcHolidayItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("h_code", arrChecked[i]);
			g4Dao.delete("AdcHoliday.deleteAdcHolidayDetailItemByCode", dto);
			g4Dao.delete("AdcHoliday.deleteAdcHolidayItem", dto);
		}
		return null;
	}

	@Override
	public Dto saveAdcHolidayDetailItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dto deleteAdcHolidayDetailItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dto updateAdcHolidayDetailItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

}
