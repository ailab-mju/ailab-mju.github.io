---
title: Members
nav:
  order: 3
  tooltip: Members
---

# <i class="fas fa-users"></i>Members



{% include section.html %}
# Professor
{%
  include list.html
  data="members"
  component="portrait"
  filters="role: pi"
%}
{% include section.html %}

# Graduate Students
{%
  include list.html
  data="members"
  component="portrait"
  filters="role: grad"
%}
{% include section.html %}
# Research Interns
{%
  include list.html
  data="members"
  component="portrait"
  filters="role: undergrad"
%}

{:.center}

{% include section.html %}

## Alumni
