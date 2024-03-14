'use strict';

// Utils
import { truncate } from '#/utils';

// Print breakers for line seperation
export const getBreaker = (index, colsList) => {
	// Clearfix classes
	let breaker = ' floatnone';
	breaker = colsList.lg && (index)%Math.floor(12/colsList.lg) == 0 ? breaker + ' floatnone__lg' : breaker;
	breaker = colsList.md && (index)%Math.floor(12/colsList.md) == 0 ? breaker + ' floatnone__md' : breaker;
	breaker = colsList.sm && (index)%Math.floor(12/colsList.sm) == 0 ? breaker + ' floatnone__sm' : breaker;
	breaker = colsList.xs && (index)%Math.floor(12/colsList.xs) == 0 ? breaker + ' floatnone__xs' : breaker;

	return breaker===' floatnone' ? '' : breaker;
}

// Check if there is a need for READ MORE
export const needsMoreButton = (text, wordLimit) => {
	return text>truncate(text, wordLimit)
}