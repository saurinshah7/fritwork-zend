<?php

namespace FritWork\Model\Entity;

class Friend {

    public $uid;
    public $name;
    public $pic_square;

    public function __construct(array $options = null) {
        if (is_array($options)) {
            $this->setOptions($options);
        }
    }

    public function __set($name, $value) {
        $method = 'set' . $name;
        if (!method_exists($this, $method)) {
            echo $name;
            throw new \Exception('Invalid Method');
        }
        $this->$method($value);
    }

    public function setId($id) {
        $this->uid = $id;
        return $this;
    }

   

    public function setName($name) {
        $this->name = $name;
        return $this;
    }

   

    public function setPicURL($pic_url) {
        $this->pic_square = $pic_url;
        return $this;
    }

}
?>
