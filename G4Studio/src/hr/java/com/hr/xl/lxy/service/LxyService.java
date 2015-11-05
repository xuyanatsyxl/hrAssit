package com.hr.xl.lxy.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface LxyService extends BaseService {
	public Dto saveLxybmsqbItem(Dto pDto);

	public Dto deleteLxybmsqbItem(Dto pDto);

	public Dto updateLxybmsqbItem(Dto pDto);

	public Dto saveLxybmsqbJyItem(Dto pDto);

	public Dto saveLxybmsqbWbItem(Dto pDto);

	public Dto deleteLxybmsqbJyItem(Dto pDto);

	public Dto deleteLxybmsqbWbItem(Dto pDto);

	public Dto updateLxyxj(Dto pDto);

	public Dto saveLxybmsqbBatch(Dto pDto);

	public Dto saveLxybmsqbJJItem(Dto pDto);

	public Dto deleteLxybmsqbJJItem(Dto pDto);
}
