from collections import defaultdict


def parse_nested_formdata(flat_data):
    """
    Transforme un QueryDict ou dict plat en dict imbriqué (clé pointée en dot-notation).
    Ex : {"a.b": "c"} -> {"a": {"b": "c"}}
    """
    def nested_dict():
        return defaultdict(nested_dict)

    result = nested_dict()

    for key, value in flat_data.items():
        parts = key.split('.')
        d = result
        for part in parts[:-1]:
            d = d[part]
        d[parts[-1]] = value[0] if isinstance(value, list) else value

    def cleanup(d):
        if isinstance(d, defaultdict):
            return {k: cleanup(v) for k, v in d.items()}
        return d

    return cleanup(result)
