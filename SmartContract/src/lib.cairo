%lang starknet
%builtins range_check

from starkware.cairo.common.default_dict import (
    default_dict_new, default_dict_finalize)
from starkware.cairo.common.dict import (
    dict_write, dict_read, dict_update)


@view
func get_value_of_keys{range_check_ptr}(
        key_1 : felt, key_2 : felt, key_3 : felt) -> (
        val_1 : felt, val_2 : felt, val_3 : felt):
    alloc_locals

    let initial_value = 13
    let (local dict) = default_dict_new(default_value=initial_value)
    # Finalize the dictionary. This ensures default value is correct.
    default_dict_finalize(
        dict_accesses_start=dict,
        dict_accesses_end=dict,
        default_value=initial_value)

    # Then add {key: val} pairs.
    dict_write{dict_ptr=dict}(key=4, new_value=17)  
    dict_write{dict_ptr=dict}(key=10, new_value=6)  

    # Check {key: value} pair is correct.
    let (key_4_val) = dict_read{dict_ptr=dict}(key=4)
    assert key_4_val = 17


    dict_update{dict_ptr=dict}(key=4,
        prev_value=17, new_value=18) 

   
    let (unused_key_999_val) = dict_read{dict_ptr=dict}(
        key=999)
    assert unused_key_999_val = 13

    # Get value of the requested keys.
    let (val_1) = dict_read{dict_ptr=dict}(key_1)
    let (val_2) = dict_read{dict_ptr=dict}(key_2)
    let (val_3) = dict_read{dict_ptr=dict}(key_3)
    return (val_1, val_2, val_3)
end