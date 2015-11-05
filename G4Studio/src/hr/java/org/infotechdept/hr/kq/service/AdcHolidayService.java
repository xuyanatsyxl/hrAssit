package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcHolidayService extends BaseService {

	public Dto saveAdcHolidayItem(Dto pDto);

	public Dto updateAdcHolidayItem(Dto pDto);

	public Dto deleteAdcHolidayItem(Dto pDto);

	public Dto saveAdcHolidayDetailItem(Dto pDto);

	public Dto deleteAdcHolidayDetailItem(Dto pDto);

	public Dto updateAdcHolidayDetailItem(Dto pDto);
}
