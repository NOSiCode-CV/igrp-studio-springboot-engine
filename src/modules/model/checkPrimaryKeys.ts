import { ERROR_MESSAGE, VALID_PRIMARY_KEY } from '../../utils/constants';
import { ModelConfig } from '../../interfaces/types';
import { checkDuplicated } from '../common/checkDuplicates';

/**
 * Checks the primary keys in the model configuration.
 * Verifies if the model has more than one simple primary key, 
 * if there is a conflict between simple and compound primary keys, 
 * or if any necessary data for key generation is missing.
 * 
 * @param model - The model configuration, which includes attributes and primary keys.
 */
export const checkPrimaryKeys = (model: ModelConfig) => {
  const { attributes, primaryKey } = model;
  const extract_primarykeys = attributes.filter(attr => attr.primaryKey===true)
  
  if (primaryKey && primaryKey.length > 0) {
    checkDuplicated(primaryKey)
  }
  
  /**
   * Checks if the model has more than one simple primary key.
   */
  if (extract_primarykeys.length > 1) 
    throw ERROR_MESSAGE.MULTIPLE_SIMPLE_PRIMARY_KEYS

  /**
   * Ensures that a compound primary key and a simple primary key 
   * are not selected simultaneously.
   */
  if (primaryKey) {
    if (primaryKey.length > 0 && extract_primarykeys.length > 0)
      throw ERROR_MESSAGE.CONFLICTING_PRIMARY_KEY_TYPES
  }

  /**
   * Verifies that a generation type is provided when a simple primary key is selected.
   */
  if (extract_primarykeys.length === 1) {
    const primarykey_attr = extract_primarykeys[0]
  
    if (primarykey_attr && !primarykey_attr.generationType)
      throw ERROR_MESSAGE.MISSING_GENERATION_TYPE_FOR_SIMPLE_PRIMARY_KEY

    if (!VALID_PRIMARY_KEY.includes(primarykey_attr.type)) {
      throw new Error(`Type '${primarykey_attr.type}' of primary key '${primarykey_attr.name}' is not valid. The type must be one of ${VALID_PRIMARY_KEY.join(', ')}`);
    }
  }

  /**
   * Ensures that at least one type of primary key is provided.
   */
  if (extract_primarykeys.length === 0 && (primaryKey?.length === 0 || !primaryKey)){
    throw ERROR_MESSAGE.MISSING_PRIMARY_KEY
  }

}
