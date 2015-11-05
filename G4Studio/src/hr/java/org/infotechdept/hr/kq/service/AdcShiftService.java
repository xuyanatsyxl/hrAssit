package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftService extends BaseService {

	public Dto saveAdcShiftItem(Dto pDto);

	public Dto updateAdcShiftItem(Dto pDto);

	public Dto deleteAdcShiftItem(Dto pDto);

	public Dto saveAdcShiftDetailItem(Dto pDto);

	public Dto updateAdcShiftDetailItem(Dto pDto);

	public Dto deleteAdcShiftDetailItem(Dto pDto);
}
