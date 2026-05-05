import { v4 as uuidv4 } from 'uuid';

const RESPONDENT_ID_KEY = 'respondent_id';

export const getRespondentId = (): string => {
  let respondentId = localStorage.getItem(RESPONDENT_ID_KEY);
  
  if (!respondentId) {
    respondentId = uuidv4();
    localStorage.setItem(RESPONDENT_ID_KEY, respondentId);
  }
  
  return respondentId;
};

export const clearRespondentId = (): void => {
  localStorage.removeItem(RESPONDENT_ID_KEY);
};
