from django import template

register = template.Library()

@register.filter
def split_first(value, delimiter=","):
    return value.split(delimiter)[0] if value else ""